// client/src/api/sales.ts
import apiService from './apiService';
import type { ApiResponse, Sale, CreateSaleInput } from '../types/api';

export const recordSale = async (data: CreateSaleInput): Promise<ApiResponse<Sale>> => {
  const response = await apiService.post<ApiResponse<Sale>>('/sales', data);
  return response.data;
};

export const getSalesHistory = async (from?: string, to?: string): Promise<ApiResponse<Sale[]>> => {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);

  const response = await apiService.get<ApiResponse<Sale[]>>('/sales', { params });
  return response.data;
};