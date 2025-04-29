import { Suspense } from "react"
import { ProductDetailWrapper } from "@/components/products/product-detail-wrapper"

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailLoading />}>
        <ProductDetailWrapper id={params.id} />
      </Suspense>
    </div>
  )
}

function ProductDetailLoading() {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-16">
      <div className="aspect-square bg-gray-200 rounded animate-pulse"></div>

      <div className="flex flex-col gap-4">
        <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>

        <div className="my-4 space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-4"></div>
      </div>
    </div>
  )
}
