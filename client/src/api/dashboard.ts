import apiService from './apiService';
import type { ApiResponse, DashboardData } from '../types/api';

export const getDashboardData = async (): Promise<ApiResponse<DashboardData>> => {
  const response = await apiService.get<ApiResponse<DashboardData>>('/dashboard');
  return response.data;
};