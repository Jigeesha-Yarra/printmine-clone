import { getDb } from "./index"

// Generic data fetcher with proper error handling
export async function fetchData<T>(fetchFn: (db: any) => Promise<T>, fallback: T): Promise<T> {
  let retries = 3
  let lastError: any = null

  while (retries > 0) {
    try {
      // Check if we have any of the required environment variables
      if (!process.env.POSTGRES_URL && !process.env.NEON_POSTGRL && !process.env.NEON_POSTGRLSQL) {
        console.error("Database connection string is not defined")
        return fallback
      }

      // Get the database connection
      const dbClient = getDb()

      // Execute the fetch function with the db
      const result = await fetchFn(dbClient)
      return result
    } catch (error) {
      lastError = error
      console.error(`Error fetching data (retries left: ${retries - 1}):`, error)

      // If this is a "relation does not exist" error, don't retry and propagate it up
      if (
        (error instanceof Error && error.message.includes("relation") && error.message.includes("does not exist")) ||
        error.message.includes('relation "products" does not exist')
      ) {
        throw error // Propagate this specific error up immediately
      }

      retries--

      // Wait before retrying
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  }

  console.error("All database connection attempts failed:", lastError)
  throw lastError || new Error("Database connection failed") // Throw the error instead of returning fallback
}
