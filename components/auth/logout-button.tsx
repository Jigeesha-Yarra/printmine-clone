"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface LogoutButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function LogoutButton({ className, variant = "default" }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      // Call the logout API endpoint
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        // Clear user from context
        setUser(null)

        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        })

        // Refresh the page to ensure the server recognizes the new auth state
        router.refresh()

        // Navigate to the home page
        router.push("/")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} disabled={isLoading} className={className} variant={variant}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  )
}
