import { FeaturedProducts } from "@/components/home/featured-products"
import { getProducts } from "@/lib/db/products"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function FeaturedProductsWrapper() {
  let featuredProducts = []
  let error = null
  let needsInitialization = false

  try {
    // Check if we have any of the required environment variables
    if (!process.env.POSTGRES_URL && !process.env.NEON_POSTGRL && !process.env.NEON_POSTGRLSQL) {
      throw new Error("Database connection string is not defined")
    }

    try {
      featuredProducts = await getProducts({ featured: true, limit: 8 })
    } catch (err) {
      // Specifically check for the "relation does not exist" error
      if (
        (err instanceof Error && err.message.includes("relation") && err.message.includes("does not exist")) ||
        err.message.includes('relation "products" does not exist')
      ) {
        needsInitialization = true
        error = "Database tables don't exist yet. Please initialize the database."
      } else {
        throw err // Re-throw if it's not the specific error we're looking for
      }
    }
  } catch (err) {
    console.error("Error fetching featured products:", err)
    error = "Failed to load featured products. Please try again later."
  }

  if (needsInitialization) {
    return (
      <Alert variant="warning" className="my-6">
        <AlertTitle>Database Needs Initialization</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>The database tables don't exist yet. This is normal for a new installation.</p>
          <p className="text-sm">Click the button below to set up the database tables and add sample data.</p>
          <Button asChild size="sm" className="w-fit">
            <Link href="/api/seed">Initialize Database</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // If we have no products but no error, show a message
  if (featuredProducts.length === 0) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <div className="text-primary hover:underline">View All</div>
        </div>

        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No featured products found</h3>
          <p className="text-muted-foreground mb-4">Check back later for our featured products.</p>
        </div>
      </section>
    )
  }

  return <FeaturedProducts products={featuredProducts} />
}
