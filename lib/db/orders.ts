import { fetchData } from "./data-fetcher"
import type { Order } from "@/types/order"

// Get orders for a specific user
export async function getUserOrders(userId: string): Promise<Order[]> {
  return fetchData(
    async (db) => {
      const sql = db.sql

      const ordersResult = await sql`
        SELECT * FROM orders
        WHERE user_id = ${Number.parseInt(userId)}
        ORDER BY created_at DESC
      `

      const result: Order[] = []

      for (const order of ordersResult.rows) {
        const itemsResult = await sql`
          SELECT * FROM order_items
          WHERE order_id = ${order.id}
        `

        result.push({
          id: order.id.toString(),
          status: order.status,
          total: order.total / 100, // Convert from paise to rupees
          createdAt: order.created_at,
          items: itemsResult.rows.map((item) => ({
            id: item.id.toString(),
            name: item.name,
            price: item.price / 100, // Convert from paise to rupees
            quantity: item.quantity,
            customizations: item.customizations || {},
          })),
        })
      }

      return result
    },
    [], // Empty array as fallback
  )
}

// Get a single order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  return fetchData(
    async (db) => {
      const sql = db.sql

      const orderResult = await sql`
        SELECT * FROM orders
        WHERE id = ${Number.parseInt(id)}
        LIMIT 1
      `

      if (orderResult.rows.length === 0) {
        return null
      }

      const order = orderResult.rows[0]

      const itemsResult = await sql`
        SELECT * FROM order_items
        WHERE order_id = ${order.id}
      `

      return {
        id: order.id.toString(),
        status: order.status,
        total: order.total / 100, // Convert from paise to rupees
        createdAt: order.created_at,
        shippingAddress: order.shipping_address,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        notes: order.notes || "",
        items: itemsResult.rows.map((item) => ({
          id: item.id.toString(),
          name: item.name,
          price: item.price / 100, // Convert from paise to rupees
          quantity: item.quantity,
          customizations: item.customizations || {},
        })),
      }
    },
    null, // null as fallback
  )
}
