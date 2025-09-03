// Legacy file - re-export from the new hooks location for backwards compatibility
// This file exists only for backwards compatibility  
// Please import from @/hooks/useProducts instead

export {
	productKeys,
	useProducts,
	useProduct,
	useProductsByVendor,
	useCreateProduct,
	useUpdateProduct,
	useApproveProduct,
	useDeleteProduct,
} from '../hooks/useProducts';