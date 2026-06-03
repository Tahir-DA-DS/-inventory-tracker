// client/src/api/products.ts
import apiService from './apiService';
import type { ApiResponse, Product, CreateProductInput, UpdateProductInput, Category } from '../types/api';

export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  const response = await apiService.get<ApiResponse<Product[]>>('/products');
  return response.data;
};

export const createProduct = async (data: CreateProductInput): Promise<ApiResponse<Product>> => {
  const response = await apiService.post<ApiResponse<Product>>('/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: UpdateProductInput): Promise<ApiResponse<Product>> => {
  const response = await apiService.patch<ApiResponse<Product>>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiService.delete(`/products/${id}`);
};

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await apiService.get<ApiResponse<Category[]>>('/categories');
  return response.data;
};