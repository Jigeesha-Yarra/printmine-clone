"use server"

import { fetchData } from "@/lib/db/data-fetcher"
import { cookies } from "next/headers"
import { SignJWT } from "jose"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change_in_production")

export async function login({ email, password }: { email: string; password: string }) {
  return fetchData(async (db) => {
    const sql = db.sql

    // Find user by email
    const result = await sql`
      SELECT * FROM users
      WHERE email = ${email}
      LIMIT 1
    `

    if (result.rows.length === 0) {
      throw new Error("Invalid email or password")
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, result.rows[0].password)

    if (!passwordMatch) {
      throw new Error("Invalid email or password")
    }

    // Create JWT token
    const token = await new SignJWT({ userId: result.rows[0].id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    // Set cookie
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Return user data (excluding password)
    const { password: _, ...userData } = result.rows[0]
    return {
      id: userData.id.toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
    }
  }, null)
}

export async function register({ name, email, password }: { name: string; email: string; password: string }) {
  return fetchData(async (db) => {
    const sql = db.sql

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users
      WHERE email = ${email}
      LIMIT 1
    `

    if (existingUser.rows.length > 0) {
      throw new Error("Email already in use")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email
    `

    // Create JWT token
    const token = await new SignJWT({ userId: result.rows[0].id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    // Set cookie
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Return user data
    return {
      id: result.rows[0].id.toString(),
      name: result.rows[0].name,
      email: result.rows[0].email,
    }
  }, null)
}

export async function logout() {
  cookies().delete("auth-token")
  redirect("/")
}
