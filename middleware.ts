import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Configure the Vercel PostgreSQL client to use our environment variables
  // Check for NEON_POSTGRLSQL first, then fall back to NEON_POSTGRL
  if (process.env.NEON_POSTGRLSQL && !process.env.POSTGRES_URL) {
    process.env.POSTGRES_URL = process.env.NEON_POSTGRLSQL
  } else if (process.env.NEON_POSTGRL && !process.env.POSTGRES_URL) {
    process.env.POSTGRES_URL = process.env.NEON_POSTGRL
  }

  return NextResponse.next()
}

// Add the config to specify which paths the middleware runs on
export const config = {
  matcher: [
    // Apply to all paths except static files and api routes that handle their own connection
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
