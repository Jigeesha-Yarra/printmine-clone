import { getRelatedProducts } from "@/lib/db/products"
import { ProductCard } from "@/components/products/product-card"

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
}

export async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const products = await getRelatedProducts(categoryId, currentProductId)

  if (products.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
