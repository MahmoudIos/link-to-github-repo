import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';
import { endpoints } from '../api/endpoints';
import { handleApiError, handleApiSuccess } from '../utils/toastHandler';
import type { ApiResponseDto } from '../types/apiResponse';
import type {
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
  ApproveProductDto,
} from '../types/api';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  byVendor: (vendorId: string) =>
    [...productKeys.all, 'vendor', vendorId] as const,
};

// API Functions - fallback to old endpoints for now
const fetchProducts = async (): Promise<ProductDto[]> => {
  const response = await api.get<ApiResponseDto<ProductDto[]>>('/api/v1/products');
  
  if (!response.data.success) {
    throw new Error(response.data.errors.join(", ") || "Failed to fetch products");
  }
  
  return response.data.data || [];
};

const fetchProduct = async (id: string): Promise<ProductDto> => {
  const response = await api.get<ApiResponseDto<ProductDto>>(`/api/v1/products/${id}`);
  
  if (!response.data.success) {
    throw new Error(response.data.errors.join(", ") || "Failed to fetch product");
  }
  
  if (!response.data.data) {
    throw new Error("Product not found");
  }
  
  return response.data.data;
};

const fetchProductsByVendor = async (vendorId: string): Promise<ProductDto[]> => {
  const response = await api.get<ApiResponseDto<ProductDto[]>>(`/api/v1/products/vendor/${vendorId}`);
  
  if (!response.data.success) {
    throw new Error(response.data.errors.join(", ") || "Failed to fetch products");
  }
  
  return response.data.data || [];
};

const createProduct = async (productData: CreateProductDto): Promise<ProductDto> => {
  const response = await api.post<ApiResponseDto<ProductDto>>('/api/v1/products', productData);
  
  if (!response.data.success) {
    throw new Error(response.data.errors.join(", ") || "Failed to create product");
  }
  
  if (!response.data.data) {
    throw new Error("No product data returned");
  }
  
  return response.data.data;
};

// React Query Hooks
export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductsByVendor = (vendorId: string) => {
  return useQuery({
    queryKey: productKeys.byVendor(vendorId),
    queryFn: () => fetchProductsByVendor(vendorId),
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      handleApiSuccess("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.byVendor(newProduct.vendorId) });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
    onError: handleApiError,
  });
};

// Simplified mutations for now
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductDto; vendorId?: string }) => {
      const response = await api.put(`/api/v1/products/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      handleApiSuccess("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: handleApiError,
  });
};

export const useApproveProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ApproveProductDto; vendorId?: string }) => {
      const response = await api.post(`/api/v1/products/${id}/approve`, data);
      return response.data;
    },
    onSuccess: () => {
      handleApiSuccess("Product approved successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: handleApiError,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; vendorId?: string }) => {
      const response = await api.delete(`/api/v1/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      handleApiSuccess("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: handleApiError,
  });
};