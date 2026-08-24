export type UserRole = "customer" | "vendor" | "admin";

export type DietaryTag = "Vegan" | "Vegetarian" | "Gluten-Free" | "Spicy" | "Halal" | "Kid-Friendly";

export interface VendorMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  dietary: DietaryTag[];
  available: boolean;
  spice?: 0 | 1 | 2 | 3;
  popular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: VendorMenuItem[];
}

export interface Vendor {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  image: string;
  cover: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  distanceKm: number;
  deliveryFee: number;
  freeDeliveryAbove: number;
  isOpen: boolean;
  email: string;
  phone: string;
    address: string;
  categories: MenuCategory[];
  status: "APPROVED" | "PENDING_REVIEW" | "SUSPENDED";
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "REJECTED";

export type PaymentMethod = "CARD" | "MOBILE" | "CASH";

export interface CartItem {
  menuItemId: string;
  vendorId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size: string;
  spice: string;
  extras: string[];
  notes: string;
}

export interface OrderLine {
  name: string;
  qty: number;
  price: number;
  options: string;
}

export interface Order {
  id: string;
  vendorId: string;
  vendorName: string;
  customerName: string;
  customerAddress: string;
  items: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  discount: number;
  total: number;
  payment: PaymentMethod;
  status: OrderStatus;
  placedAt: number;
  etaMinutes: number;
  note?: string;
}

export interface Review {
  id: string;
  vendorId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PlatformMetrics {
  gmv: number;
  commissionRate: number;
  activeVendors: number;
  totalOrders: number;
}