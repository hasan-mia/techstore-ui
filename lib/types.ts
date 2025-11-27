// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  avatar?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
}

// Login Response types
export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role_id: string;
    role: "USER" | "ADMIN";
    avatar: string | null;
  };
  permissions: string[];
  accessToken: string;
  refreshToken: string;
}

// Register Response types
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role_id: string;
      role: "USER" | "ADMIN";
      avatar: string | null;
    };
    permissions: string[];
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserInfoResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    avatar: string | null;
    email: string;
    name: string;
    phone: string | null;
    role_id: string;
    address: string | null;
    created_at: string;
    updated_at: string;
    role: "USER" | "ADMIN";
    permissions: string[];
  };
}

export interface Hero {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  bg_color: string
  cta: string
  category_id?: string | null
  product_id?: string | null
  price: string
  badge?: string | null
  order: number
  status: "active" | "inactive"
  created_at: string
  updated_at: string
  product?: {
    id: string
    name: string
    price: string
    images: string[]
    stock: number
    status: string
  }
  category?: {
    id: string
    name: string
    description?: string
  }
}

export interface HeroResponse {
  success: boolean
  message: string
  data: Hero[]
}


// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  categories: Category[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


// Product Types
export interface Product {
  data: Product | undefined;
  id: string;
  name: string;
  description: string;
  price: string; // Coming as string from API
  images: string[];
  category_id: string;
  stock: number;
  rating: string; // Coming as string from API
  reviews: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at: string;
  updated_at: string;
  category: Category;
  total_sold?: number; // Only for best sellers
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
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
