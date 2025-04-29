"use client"

import { useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function DatabaseInitBanner() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setError(null)

    try {
      const response = await fetch("/api/seed")
      const data = await response.json()

      if (data.success) {
        // Refresh the page to show the new data
        router.refresh()
      } else {
        setError(data.message || "Failed to initialize database")
      }
    } catch (err) {
      setError("An error occurred while initializing the database")
      console.error(err)
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <Alert variant="warning" className="my-6">
      <AlertTitle>Database Needs Initialization</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>The database tables don't exist yet. This is normal for a new installation.</p>
        <div>
          <Button onClick={initializeDatabase} disabled={isInitializing} className="mr-2">
            {isInitializing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isInitializing ? "Initializing..." : "Initialize Database"}
          </Button>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </AlertDescription>
    </Alert>
  )
}
