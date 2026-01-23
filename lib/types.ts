export type Language = "fr" | "ar"

export interface Product {
  id: string
  nameFr: string
  nameAr: string
  descriptionFr: string
  descriptionAr: string
  oldPrice: number
  newPrice: number
  image: string
  images: string[]
  category: string
  brand: string
  model: string
  year: string
  fitmentYearsFrom?: string
  fitmentYearsTo?: string
  stock: number
  sku: string
}

export interface CartItem {
  product: Product
  quantity: number
  priceAtAdd: number
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "returned"
  customer: {
    name: string
    phone: string
    address: string
    wilaya: string
  }
  paymentMethod: "cash" | "baridimob"
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  phone: string
  address?: string
  wilaya?: string
  role: "customer" | "admin"
  createdAt: Date
}
