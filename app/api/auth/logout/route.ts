import { NextResponse } from "next/response"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Delete the auth cookie
    cookies().delete("auth-token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in /api/auth/logout:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
