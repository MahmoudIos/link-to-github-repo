import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/api';
import { endpoints } from '../api/endpoints';
import { handleApiError, handleApiSuccess } from '../utils/toastHandler';
import type { ApiResponseDto } from '../types/apiResponse';
import type { VendorDto, CreateVendorDto, UpdateVendorDto } from '../types/api';

// Query Keys
export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (filters: string) => [...vendorKeys.lists(), { filters }] as const,
  details: () => [...vendorKeys.all, 'detail'] as const,
  detail: (id: string) => [...vendorKeys.details(), id] as const,
};

// API Functions
const fetchVendors = async (): Promise<VendorDto[]> => {
  const response = await api.get<ApiResponseDto<VendorDto[]>>(endpoints.vendors.list);
  
  if (!response.data.success) {
    throw new Error(response.data.errors.join(", ") || "Failed to fetch vendors");
  }
  
  return response.data.data || [];
};

const fetchVendor = async (id: string): Promise<VendorDto> => {
  const response = await api.get<ApiResponseDto<VendorDto>>(endpoints.vendors.getById(id));
  
  if (!response.data.success) {
    throw new Error(response.data.errors.join(", ") || "Failed to fetch vendor");
  }
  
  if (!response.data.data) {
    throw new Error("Vendor not found");
  }
  
  return response.data.data;
};

const createVendor = async (vendorData: CreateVendorDto): Promise<VendorDto> => {
  const response = await api.post<ApiResponseDto<VendorDto>>(endpoints.vendors.create, vendorData);
  
  if (!response.data.success) {
    throw new Error(response.data.errors.join(", ") || "Failed to create vendor");
  }
  
  if (!response.data.data) {
    throw new Error("No vendor data returned");
  }
  
  return response.data.data;
};

const updateVendor = async (id: string, vendorData: UpdateVendorDto): Promise<void> => {
  const response = await api.put<ApiResponseDto<void>>(endpoints.vendors.update(id), vendorData);
  
  if (!response.data.success) {
    throw new Error(response.data.errors.join(", ") || "Failed to update vendor");
  }
};

const deleteVendor = async (id: string): Promise<void> => {
  const response = await api.delete<ApiResponseDto<void>>(endpoints.vendors.delete(id));
  
  if (!response.data.success) {
    throw new Error(response.data.errors.join(", ") || "Failed to delete vendor");
  }
};

// React Query Hooks
export const useVendors = () => {
  return useQuery({
    queryKey: vendorKeys.lists(),
    queryFn: fetchVendors,
    staleTime: 5 * 60 * 1000,
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => fetchVendor(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      handleApiSuccess("Vendor created successfully!");
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
    onError: handleApiError,
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVendorDto }) =>
      updateVendor(id, data),
    onSuccess: (_, { id }) => {
      handleApiSuccess("Vendor updated successfully!");
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
    onError: handleApiError,
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      handleApiSuccess("Vendor deleted successfully!");
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
    },
    onError: handleApiError,
  });
};