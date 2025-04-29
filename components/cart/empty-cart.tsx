"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

export function EmptyCart() {
  const { cartItems } = useCart()

  if (cartItems.length > 0) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
      <Button asChild>
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  )
}
