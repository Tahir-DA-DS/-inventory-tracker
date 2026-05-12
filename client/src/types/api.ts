// ─── Category ───────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  created_at: string;
}

// ─── Product ─────────────────────────────────────────────
export interface Product {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  sku: string;
  price: number;
  stock_qty: number;
  low_stock_threshold: number;
  created_at: string;
}

export interface CreateProductInput {
  category_id: string;
  name: string;
  sku: string;
  price: number;
  stock_qty: number;
  low_stock_threshold: number;
}

// ─── Sales ───────────────────────────────────────────────
export interface SaleItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface Sale {
  id: string;
  total_amount: number;
  notes?: string;
  sold_at: string;
  items: SaleItem[];
}

export interface CreateSaleInput {
  items: SaleItem[];
  notes?: string;
}

// ─── Dashboard ───────────────────────────────────────────
export interface DashboardData {
  revenue: {
    today: number;
    this_week: number;
    this_month: number;
  };
  low_stock_products: Pick<Product, 'id' | 'name' | 'sku' | 'stock_qty' | 'low_stock_threshold'>[];
  top_sellers: {
    product_id: string;
    product_name: string;
    total_sold: number;
    total_revenue: number;
  }[];
}

// ─── API Response wrapper ────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}