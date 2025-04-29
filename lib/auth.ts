import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { fetchData } from "@/lib/db/data-fetcher"
import type { User } from "@/types/user"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_please_change_in_production")

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = cookies().get("auth-token")?.value

    if (!token) {
      return null
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as number

    // Get user from database
    return fetchData(
      async (db) => {
        const sql = db.sql

        const result = await sql`
          SELECT * FROM users
          WHERE id = ${userId}
          LIMIT 1
        `

        if (result.rows.length === 0) {
          return null
        }

        // Return user data (excluding password)
        const { password: _, ...userData } = result.rows[0]
        return {
          id: userData.id.toString(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        }
      },
      null, // null as fallback
    )
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
