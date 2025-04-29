import { getUserOrders } from "@/lib/db/orders"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface OrderHistoryProps {
  userId: string
}

export async function OrderHistory({ userId }: OrderHistoryProps) {
  const orders = await getUserOrders(userId)

  if (orders.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>
        <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Order History</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Order #{order.id}</div>
                <div className="font-medium">{formatDate(order.createdAt)}</div>
              </div>

              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    order.status === "delivered"
                      ? "default"
                      : order.status === "processing"
                        ? "secondary"
                        : order.status === "shipped"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>

                <Button asChild variant="outline" size="sm">
                  <Link href={`/account/orders/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              {order.items.length > 2 && (
                <div className="text-sm text-muted-foreground">+ {order.items.length - 2} more items</div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between font-medium">
              <span>Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
