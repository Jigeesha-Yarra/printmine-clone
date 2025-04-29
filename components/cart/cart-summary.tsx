"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

export function CartSummary() {
  const { cartItems } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  if (cartItems.length === 0) {
    return null
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 100
  const total = subtotal + shipping

  const handleCheckout = () => {
    if (!user) {
      router.push("/login?redirect=/checkout")
    } else {
      router.push("/checkout")
    }
  }

  return (
    <div className="rounded-lg border p-6 space-y-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
        </div>

        <div className="border-t pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={handleCheckout}>
        Proceed to Checkout
      </Button>

      {shipping > 0 && <p className="text-xs text-center text-muted-foreground">Free shipping on orders over ₹1,000</p>}
    </div>
  )
}
