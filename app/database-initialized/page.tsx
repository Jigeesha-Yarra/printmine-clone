import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function DatabaseInitializedPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Database Initialized Successfully!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your database has been set up with sample data. You can now explore the PrintMine Clone application.
        </p>
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <div className="text-sm text-gray-500">
            <p>Test user credentials:</p>
            <p>Email: test@example.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
