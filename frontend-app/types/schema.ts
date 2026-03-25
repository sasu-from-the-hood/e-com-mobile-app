import type { ProductCategory, PaymentMethod } from './enums';

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  colorImages?: { [color: string]: string[] };
  categoryId?: string;
  brand?: string;
  sku?: string;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  variantStock?: { [key: string]: number }; // Stock per color-size variant (e.g., "#931f1f-M": 10)
  rating?: string;
  reviewCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  discount?: number;
  isFeatured?: boolean;
  // Legacy fields for compatibility
  category?: ProductCategory;
  reviews?: number;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
  size?: string;
  color?: string;
  selected?: boolean;
}

// Address types
export interface Address {
  id: string;
  name: string;
  address: string;
  isDefault: boolean;
}

// Payment types
export interface PaymentMethodData {
  id: string;
  type: PaymentMethod;
  cardNumber: string;
  expiryDate: string;
  isDefault: boolean;
}

// Search types
export interface PopularSearch {
  term: string;
  color: string;
}

// User types
export interface User {
  name: string;
  location: string;
}

// Extended User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: any;
  profileCompletion: number;
  hasAddress?: boolean;
  hasPaymentMethod?: boolean;
}

// Order tracking types
export interface DeliveryPerson {
  name: string;
  phone: string;
  avatar: any;
  rating: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface OrderTimeline {
  status: string;
  date: string;
  completed: boolean;
}

export interface OrderTracking {
  orderId: string;
  status: string;
  estimatedDelivery: string;
  deliveryPerson: DeliveryPerson;
  currentLocation: Location;
  deliveryLocation: Location;
  timeline: OrderTimeline[];
}

// Order history types
export interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  createdAt?: Date;
  status: string;
  items: number;
  total: number;
  thumbnail: any;
  deliveryBoy?: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Review types
export interface Review {
  id: string;
  userName: string;
  userAvatar: any;
  rating: number;
  date: Date;
  comment: string;
  helpful: number;
}

// Address form types
export interface AddressForm {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: string;
  longitude?: string;
  instructions?: string;
  isDefault: boolean;
}