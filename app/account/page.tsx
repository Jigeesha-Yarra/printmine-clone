import { redirect } from "next/navigation"
import { AccountDetails } from "@/components/account/account-details"
import { OrderHistory } from "@/components/account/order-history"
import { getCurrentUser } from "@/lib/auth"
import { Suspense } from "react"

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <AccountDetails user={user} />
        </div>

        <div className="md:col-span-2">
          <Suspense fallback={<OrderHistoryLoading />}>
            <OrderHistory userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function OrderHistoryLoading() {
  return (
    <div className="border rounded-lg p-6">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

      <div className="space-y-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-2">
                {Array(2)
                  .fill(0)
                  .map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
