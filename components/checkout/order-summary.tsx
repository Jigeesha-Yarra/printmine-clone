"use client"

import { useCart } from "@/context/cart-context"

export function OrderSummary() {
  const { cartItems } = useCart()

  if (cartItems.length === 0) {
    return null
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 100
  const total = subtotal + shipping

  return (
    <div className="rounded-lg border p-6 space-y-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
            </span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-4">
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
    </div>
  )
}
