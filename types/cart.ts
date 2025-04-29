export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  customizations?: Record<string, string>
}
