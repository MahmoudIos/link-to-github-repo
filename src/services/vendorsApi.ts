import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import type { VendorDto, CreateVendorDto, UpdateVendorDto } from '@/types/api';

// Query Keys
export const vendorKeys = {
	all: ['vendors'] as const,
	lists: () => [...vendorKeys.all, 'list'] as const,
	list: (filters: string) => [...vendorKeys.lists(), { filters }] as const,
	details: () => [...vendorKeys.all, 'detail'] as const,
	detail: (id: string) => [...vendorKeys.details(), id] as const,
};

// API Functions
export const useVendorsApi = () => {
	const { apiPublic, apiPrivate } = useApi();

	const fetchVendors = async (): Promise<VendorDto[]> => {
		const response = await apiPublic.get('/api/v1/vendors');
		return response.data;
	};

	const fetchVendor = async (id: string): Promise<VendorDto> => {
		const response = await apiPublic.get(`/api/v1/vendors/${id}`);
		return response.data;
	};

	const createVendor = async (
		vendorData: CreateVendorDto
	): Promise<VendorDto> => {
		const response = await apiPrivate.post('/api/v1/vendors', vendorData);
		return response.data;
	};

	const updateVendor = async (
		id: string,
		vendorData: UpdateVendorDto
	): Promise<void> => {
		await apiPrivate.put(`/api/v1/vendors/${id}`, vendorData);
	};

	const deleteVendor = async (id: string): Promise<void> => {
		await apiPrivate.delete(`/api/v1/vendors/${id}`);
	};

	return {
		fetchVendors,
		fetchVendor,
		createVendor,
		updateVendor,
		deleteVendor,
	};
};

// React Query Hooks
export const useVendors = () => {
	const { fetchVendors } = useVendorsApi();

	return useQuery({
		queryKey: vendorKeys.lists(),
		queryFn: fetchVendors,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useVendor = (id: string) => {
	const { fetchVendor } = useVendorsApi();

	return useQuery({
		queryKey: vendorKeys.detail(id),
		queryFn: () => fetchVendor(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useCreateVendor = () => {
	const queryClient = useQueryClient();
	const { createVendor } = useVendorsApi();

	return useMutation({
		mutationFn: createVendor,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
		},
	});
};

export const useUpdateVendor = () => {
	const queryClient = useQueryClient();
	const { updateVendor } = useVendorsApi();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateVendorDto }) =>
			updateVendor(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: vendorKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
		},
	});
};

export const useDeleteVendor = () => {
	const queryClient = useQueryClient();
	const { deleteVendor } = useVendorsApi();

	return useMutation({
		mutationFn: deleteVendor,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
		},
	});
};
