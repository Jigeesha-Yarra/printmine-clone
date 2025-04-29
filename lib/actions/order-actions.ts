"use server"

import { fetchData } from "@/lib/db/data-fetcher"
import type { CartItem } from "@/types/cart"
import { revalidatePath } from "next/cache"

interface OrderData {
  userId: string
  items: CartItem[]
  shippingAddress: {
    name: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: string
  notes?: string
}

export async function createOrder(data: OrderData) {
  return fetchData(
    async (db) => {
      const sql = db.sql

      // Calculate total
      const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100 // Convert to paise

      // Insert order
      const orderResult = await sql`
        INSERT INTO orders (user_id, total, shipping_address, payment_method, notes)
        VALUES (
          ${Number.parseInt(data.userId)},
          ${total},
          ${JSON.stringify(data.shippingAddress)},
          ${data.paymentMethod},
          ${data.notes || null}
        )
        RETURNING id, status
      `

      const orderId = orderResult.rows[0].id

      // Insert order items
      for (const item of data.items) {
        await sql`
          INSERT INTO order_items (order_id, product_id, name, price, quantity, customizations)
          VALUES (
            ${orderId},
            ${Number.parseInt(item.id)},
            ${item.name},
            ${item.price * 100}, 
            ${item.quantity},
            ${JSON.stringify(item.customizations || {})}
          )
        `
      }

      revalidatePath("/account")

      return {
        id: orderId.toString(),
        status: orderResult.rows[0].status,
      }
    },
    { id: "error", status: "error" },
  )
}

export async function updateOrderStatus(orderId: string, status: string) {
  return fetchData(
    async (db) => {
      const sql = db.sql

      await sql`
        UPDATE orders
        SET status = ${status}
        WHERE id = ${Number.parseInt(orderId)}
      `

      revalidatePath(`/account/orders/${orderId}`)
      revalidatePath("/account")

      return { success: true }
    },
    { success: false },
  )
}
