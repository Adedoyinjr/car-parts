export type UserRole = 'super-admin' | 'inventory-manager' | 'sales-staff' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  comparePrice?: number;
  image: string;
  images: string[];
  category: string;
  categoryId: string;
  supplier: string;
  supplierId: string;
  quantity: number;
  lowStockThreshold: number;
  compatibility: VehicleCompatibility[];
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface VehicleCompatibility {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'received' | 'sold' | 'returned' | 'damaged' | 'adjusted';
  quantity: number;
  previousStock: number;
  newStock: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'system' | 'payment';
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  inventoryValue: number;
  lowStockCount: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
}

export interface CategoryPerformance {
  name: string;
  value: number;
}
