"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

export function CartItems() {
  const { cartItems, updateQuantity, removeFromCart } = useCart()

  if (cartItems.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>

          <div className="flex flex-1 flex-col">
            <Link href={`/products/${item.id}`} className="font-medium hover:text-primary">
              {item.name}
            </Link>
            <div className="mt-1 text-sm text-muted-foreground">₹{item.price.toFixed(2)}</div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>

          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
