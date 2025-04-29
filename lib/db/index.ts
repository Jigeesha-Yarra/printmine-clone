import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Get the database connection string
const getConnectionString = () => {
  // Check for all possible environment variable names
  return process.env.NEON_POSTGRLSQL || process.env.NEON_POSTGRL || process.env.POSTGRES_URL || ""
}

// Create a SQL client with Neon serverless driver
export function getSqlClient() {
  const connectionString = getConnectionString()

  if (!connectionString) {
    throw new Error(
      "Database connection string is not defined. Please set NEON_POSTGRLSQL, NEON_POSTGRL, or POSTGRES_URL environment variable.",
    )
  }

  return neon(connectionString)
}

// Get the database client
export function getDb() {
  const sql = getSqlClient()
  return {
    sql,
    db: drizzle(sql, { schema }),
  }
}
