import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-all">
      <div className="aspect-square relative overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 opacity-70 hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>

      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="font-semibold">₹{product.price.toFixed(2)}</p>
      </div>
    </div>
  )
}
