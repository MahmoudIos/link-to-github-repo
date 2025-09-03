import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import type {
	ProductDto,
	CreateProductDto,
	UpdateProductDto,
	ApproveProductDto,
} from '@/types/api';

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

// API Functions
export const useProductsApi = () => {
	const { apiPublic, apiPrivate } = useApi();

	const fetchProducts = async (): Promise<ProductDto[]> => {
		const response = await apiPublic.get('/api/v1/products');
		return response.data;
	};

	const fetchProduct = async (id: string): Promise<ProductDto> => {
		const response = await apiPublic.get(`/api/v1/products/${id}`);
		return response.data;
	};

	const fetchProductsByVendor = async (
		vendorId: string
	): Promise<ProductDto[]> => {
		const response = await apiPublic.get(`/api/v1/products/vendor/${vendorId}`);
		return response.data;
	};

	const createProduct = async (
		productData: CreateProductDto
	): Promise<ProductDto> => {
		const response = await apiPrivate.post('/api/v1/products', productData);
		return response.data;
	};

	const updateProduct = async (
		id: string,
		productData: UpdateProductDto
	): Promise<void> => {
		await apiPrivate.put(`/api/v1/products/${id}`, productData);
	};

	const approveProduct = async (
		id: string,
		approvalData: ApproveProductDto
	): Promise<void> => {
		await apiPrivate.post(`/api/v1/products/${id}/approve`, approvalData);
	};

	const deleteProduct = async (id: string): Promise<void> => {
		await apiPrivate.delete(`/api/v1/products/${id}`);
	};

	return {
		fetchProducts,
		fetchProduct,
		fetchProductsByVendor,
		createProduct,
		updateProduct,
		approveProduct,
		deleteProduct,
	};
};

// React Query Hooks
export const useProducts = () => {
	const { fetchProducts } = useProductsApi();

	return useQuery({
		queryKey: productKeys.lists(),
		queryFn: fetchProducts,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useProduct = (id: string) => {
	const { fetchProduct } = useProductsApi();

	return useQuery({
		queryKey: productKeys.detail(id),
		queryFn: () => fetchProduct(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useProductsByVendor = (vendorId: string) => {
	const { fetchProductsByVendor } = useProductsApi();

	return useQuery({
		queryKey: productKeys.byVendor(vendorId),
		queryFn: () => fetchProductsByVendor(vendorId),
		enabled: !!vendorId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { createProduct } = useProductsApi();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (newProduct) => {
      // Invalidate all products lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Invalidate vendor-specific products list
      queryClient.invalidateQueries({ queryKey: productKeys.byVendor(newProduct.vendorId) });
      // Also invalidate vendors list to update product counts
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();
	const { updateProduct } = useProductsApi();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
			updateProduct(id, data),
		onSuccess: (_, { id }) => {
			// Invalidate specific product
			queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
			// Invalidate all products lists
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
			// Invalidate all vendor-specific products lists (since we don't know the vendor ID here)
			queryClient.invalidateQueries({ queryKey: productKeys.all });
			// Also invalidate vendors list to update product counts
			queryClient.invalidateQueries({ queryKey: ['vendors'] });
		},
	});
};

export const useApproveProduct = () => {
	const queryClient = useQueryClient();
	const { approveProduct } = useProductsApi();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ApproveProductDto }) =>
			approveProduct(id, data),
		onSuccess: (_, { id }) => {
			// Invalidate specific product
			queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
			// Invalidate all products lists
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
			// Invalidate all vendor-specific products lists (since we don't know the vendor ID here)
			queryClient.invalidateQueries({ queryKey: productKeys.all });
			// Also invalidate vendors list to update product counts
			queryClient.invalidateQueries({ queryKey: ['vendors'] });
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();
	const { deleteProduct } = useProductsApi();

	return useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			// Invalidate all products lists
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
			// Invalidate all vendor-specific products lists (since we don't know the vendor ID here)
			queryClient.invalidateQueries({ queryKey: productKeys.all });
			// Also invalidate vendors list to update product counts
			queryClient.invalidateQueries({ queryKey: ['vendors'] });
		},
	});
};
