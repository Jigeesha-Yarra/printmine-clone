export interface User {
  id: string
  name: string | null
  email: string
  phone?: string | null
  address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
  } | null
}
