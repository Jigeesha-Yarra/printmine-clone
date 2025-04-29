import { HeroSection } from "@/components/home/hero-section"
import { CategoryShowcase } from "@/components/home/category-showcase"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { Suspense } from "react"
import { FeaturedProductsWrapper } from "@/components/home/featured-products-wrapper"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  // Check if we have any of the required environment variables
  const hasDatabaseConfig = process.env.POSTGRES_URL || process.env.NEON_POSTGRL || process.env.NEON_POSTGRLSQL

  return (
    <div className="container mx-auto px-4">
      <HeroSection />

      {!hasDatabaseConfig ? (
        <Alert variant="destructive" className="my-6">
          <AlertTitle>Database Configuration Missing</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <p>
              The database connection string is not configured. Please add the NEON_POSTGRLSQL, NEON_POSTGRL, or
              POSTGRES_URL environment variable.
            </p>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="my-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Welcome to PrintMine Clone</h2>
          <p className="text-amber-700 mb-4">
            Before you can use the application, you need to initialize the database. This will create all necessary
            tables and add sample data.
          </p>
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link href="/api/seed">Initialize Database Now</Link>
          </Button>
        </div>
      )}

      <Suspense fallback={<FeaturedProductsLoading />}>
        <FeaturedProductsWrapper />
      </Suspense>

      <CategoryShowcase />
      <WhyChooseUs />
    </div>
  )
}

function FeaturedProductsLoading() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
