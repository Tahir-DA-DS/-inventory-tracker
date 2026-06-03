// client/src/api/dashboard.ts
import apiService from './apiService';
import type { ApiResponse, DashboardData } from '../types/api';

export const getDashboardData = async (): Promise<ApiResponse<DashboardData>> => {
  // For now, we'll use mock data as the backend endpoint is still being built
  // Once the API is ready, uncomment the lines below and remove the mock data
  /*
  const response = await apiService.get<ApiResponse<DashboardData>>('/dashboard');
  return response.data;
  */

  // --- MOCK DATA ---
  return {
    data: {
      revenue: {
        today: 84200,
        this_week: 412500,
        this_month: 1800000
      },
      low_stock_products: [
        { id: "p-mouse", name: "Wireless Mouse", sku: "MOU-001", stock_qty: 8, low_stock_threshold: 10 },
        { id: "p-keyboard", name: "Mechanical Keyboard", sku: "KEY-001", stock_qty: 3, low_stock_threshold: 5 },
        { id: "p-hub", name: "USB-C Hub", sku: "HUB-002", stock_qty: 0, low_stock_threshold: 5 },
        { id: "p-cable", name: "HDMI Cable", sku: "CAB-004", stock_qty: 5, low_stock_threshold: 5 },
      ],
      top_sellers: [
        { product_id: "p-laptop", product_name: "Laptop Pro", total_sold: 3, total_revenue: 2997000 },
        { product_id: "p-monitor", product_name: "Monitor 27\"", total_sold: 2, total_revenue: 1400000 },
        { product_id: "p-hub", product_name: "USB-C Hub", total_sold: 5, total_revenue: 630000 },
      ]
    }
  };
};