// client/src/types/api.ts

/**
 * Generic API response structure.
 * Use this to wrap actual data from API calls.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string; // Optional message for success/error
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * --- Products Module ---
 */

export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string;
  category_name: string; // Denormalized for display
  price: string; // Use string for currency to avoid floating point issues
  stock_qty: number;
  low_stock_threshold: number;
  created_at: string;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  category_id: string;
  price: string;
  stock_qty: number;
  low_stock_threshold: number;
}

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  category_id?: string;
  price?: string;
  stock_qty?: number;
  low_stock_threshold?: number;
}

export interface Category {
  id: string;
  name: string;
}

/**
 * --- Sales Module ---
 */

export interface SaleItem {
  product_id: string;
  product_name: string; // Denormalized for display
  quantity: number;
  unit_price: string; // Use string for currency
  // Optionally, you might add item_total here if needed
}

export interface Sale {
  id: string;
  sale_date: string; // ISO string format
  items: SaleItem[];
  total_amount: string; // Total for the entire sale
  notes?: string;
  created_at: string;
}

export interface CreateSaleItemInput {
  product_id: string;
  quantity: number;
  unit_price: string; // Price at the time of sale, can differ from current product price
}

export interface CreateSaleInput {
  items: CreateSaleItemInput[];
  notes?: string;
}

/**
 * --- Dashboard Module ---
 */

export interface RevenueMetrics {
  today: number;
  this_week: number;
  this_month: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock_qty: number;
  low_stock_threshold: number;
}

export interface TopSeller {
  product_id: string;
  product_name: string;
  total_sold: number;
  total_revenue: number; // Sum of revenue from this product in the period
}

export interface DashboardData {
  revenue: RevenueMetrics;
  low_stock_products: LowStockProduct[];
  top_sellers: TopSeller[];
}