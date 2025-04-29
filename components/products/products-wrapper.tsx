import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductSort } from "@/components/products/product-sort"
import { getProducts } from "@/lib/db/products"
import { getCategories } from "@/lib/db/categories"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export async function ProductsWrapper({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest"
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  let products = []
  let categories = []
  let error = null

  try {
    products = await getProducts({
      category,
      sort,
      page,
      limit: 12,
    })

    categories = await getCategories()
  } catch (err) {
    console.error("Error fetching products or categories:", err)
    error = "Failed to load products. Please try again later."
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4">
        <ProductFilters categories={categories} />
      </div>

      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">Showing {products.length} products</p>
          <ProductSort />
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  )
}
