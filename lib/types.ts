// User Types
export interface User {
  id: string
  email: string
  name: string
  role: "USER" | "ADMIN"
  createdAt: Date
}

// Product Types
export interface Category {
  id: string
  name: string
  description: string
  image: string
}

export interface Product {
  [x: string]: any
  id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  category?: Category
  stock: number
  rating: number
  reviews: number
  createdAt: Date
}

// Cart Types
export interface CartItem {
  id: string
  productId: string
  product?: Product
  quantity: number
  price: number
}

// Order Types
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  STRIPE = "STRIPE",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}

export interface Order {
  id: string
  userId: string
  user?: User
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: PaymentMethod
  totalAmount: number
  shippingAddress: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  price: number
}

// Transaction Types
export interface Transaction {
  id: string
  orderId: string
  order?: Order
  amount: number
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  method: PaymentMethod
  createdAt: Date
}

// Wishlist Types
export interface Wishlist {
  id: string
  userId: string
  productId: string
  product?: Product
  createdAt: Date
}
