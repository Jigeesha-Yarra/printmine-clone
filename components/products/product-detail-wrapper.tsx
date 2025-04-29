import { notFound } from "next/navigation"
import { getProductById } from "@/lib/db/products"
import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { ProductImageGallery } from "@/components/products/product-image-gallery"
import { ProductCustomization } from "@/components/products/product-customization"
import { RelatedProducts } from "@/components/products/related-products"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export async function ProductDetailWrapper({ id }: { id: string }) {
  let product = null
  let error = null

  try {
    product = await getProductById(id)
  } catch (err) {
    console.error("Error fetching product:", err)
    error = "Failed to load product details. Please try again later."
  }

  if (!product && !error) {
    notFound()
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
    <>
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <ProductImageGallery images={product.images} />

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="text-2xl font-semibold">₹{product.price.toFixed(2)}</div>

          <div className="prose max-w-none my-4">
            <p>{product.description}</p>
          </div>

          {product.customizable && <ProductCustomization options={product.customizationOptions} />}

          <AddToCartButton product={product} />
        </div>
      </div>

      <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
    </>
  )
}
