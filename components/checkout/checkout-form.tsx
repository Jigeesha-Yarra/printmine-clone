"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCart } from "@/context/cart-context"
import { createOrder } from "@/lib/actions/order-actions"
import type { User } from "@/types/user"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  pincode: z.string().min(6, "Pincode must be at least 6 characters"),
  notes: z.string().optional(),
})

interface CheckoutFormProps {
  user: User
}

export function CheckoutForm({ user }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { cartItems, clearCart } = useCart()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      pincode: user.address?.pincode || "",
      notes: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (cartItems.length === 0) return

    setIsSubmitting(true)

    try {
      const orderData = {
        userId: user.id,
        items: cartItems,
        shippingAddress: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          street: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
        },
        paymentMethod,
        notes: values.notes,
      }

      const order = await createOrder(orderData)

      // Mock payment process
      if (paymentMethod === "razorpay") {
        // In a real app, you would integrate with Razorpay here
        // For now, we'll just simulate a successful payment
        setTimeout(() => {
          clearCart()
          router.push(`/order-success?orderId=${order.id}`)
        }, 1500)
      } else {
        // For COD, just proceed
        clearCart()
        router.push(`/order-success?orderId=${order.id}`)
      }
    } catch (error) {
      console.error("Error creating order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Shipping Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Mumbai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="400001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Special instructions for delivery" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Payment Method</h2>

          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="razorpay" id="razorpay" />
              <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                <div className="font-medium">Razorpay</div>
                <div className="text-sm text-muted-foreground">Pay securely with credit/debit card or UPI</div>
              </Label>
              <div className="flex items-center space-x-2">
                <Image src="/stylized-payment-card.png" alt="Visa" width={30} height={30} />
                <Image src="/interlocking-circles.png" alt="Mastercard" width={30} height={30} />
                <Image src="/unified-payments-interface.png" alt="UPI" width={30} height={30} />
              </div>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                <div className="font-medium">Cash on Delivery</div>
                <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </Form>
  )
}
