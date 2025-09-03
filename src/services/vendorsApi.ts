// Legacy file - re-export from the new hooks location for backwards compatibility
// This file exists only for backwards compatibility
// Please import from @/hooks/useVendors instead

export {
	vendorKeys,
	useVendors,
	useVendor,
	useCreateVendor,
	useUpdateVendor,
	useDeleteVendor,
} from '../hooks/useVendors';