export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  categoryId: string
  featured: boolean
  customizable: boolean
  customizationOptions?: CustomizationOption[]
  stock: number
}

export interface CustomizationOption {
  id: string
  name: string
  type: "text" | "textarea" | "select"
  placeholder?: string
  choices?: { value: string; label: string }[]
}
