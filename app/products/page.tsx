import { Suspense } from "react"
import { ProductsWrapper } from "@/components/products/products-wrapper"

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <Suspense fallback={<ProductsLoading />}>
        <ProductsWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

function ProductsLoading() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4">
        <div className="space-y-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(12)
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
      </div>
    </div>
  )
}
