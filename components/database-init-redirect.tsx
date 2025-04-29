"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function DatabaseInitRedirect() {
  const [status, setStatus] = useState("Initializing database...")
  const router = useRouter()

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const response = await fetch("/api/seed")
        const data = await response.json()

        if (data.success) {
          setStatus("Database initialized successfully! Redirecting...")
          setTimeout(() => {
            router.push("/database-initialized")
          }, 1500)
        } else {
          setStatus(`Error: ${data.message || "Failed to initialize database"}`)
        }
      } catch (err) {
        setStatus("An error occurred while initializing the database")
        console.error(err)
      }
    }

    initializeDatabase()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Please Wait</h1>
      <p className="text-gray-600">{status}</p>
    </div>
  )
}
