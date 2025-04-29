export interface Order {
  id: string
  status: string
  total: number
  createdAt: Date
  shippingAddress?: {
    name: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod?: string
  paymentStatus?: string
  notes?: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    customizations?: Record<string, string>
  }[]
}
