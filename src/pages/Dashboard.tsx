import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/navigation/navbar';
import { VendorDistributionChart } from '@/components/charts/vendor-distribution-chart';
import { VendorRatingsChart } from '@/components/charts/vendor-ratings-chart';
import { VendorForm } from '@/components/forms/vendor-form';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	useVendors,
	useCreateVendor,
	useUpdateVendor,
	useDeleteVendor,
} from '@/services/vendorsApi';
import {
	useProducts,
	useCreateProduct,
	useUpdateProduct,
	useDeleteProduct,
} from '@/services/productsApi';
import { ProductForm } from '@/components/forms/product-form';
import type {
	VendorDto,
	UpdateVendorDto,
	ProductDto,
	CreateProductDto,
	UpdateProductDto,
} from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const Dashboard = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [currentUser, setCurrentUser] = useState('');
	const [isVendorFormOpen, setIsVendorFormOpen] = useState(false);
	const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
	const [editingVendor, setEditingVendor] = useState<VendorDto | null>(null);
	const [deletingVendorId, setDeletingVendorId] = useState<string | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [vendorToDelete, setVendorToDelete] = useState<VendorDto | null>(null);

	// Products state
	const [isProductFormOpen, setIsProductFormOpen] = useState(false);
	const [isEditProductOpen, setIsEditProductOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
	const [deletingProductId, setDeletingProductId] = useState<string | null>(
		null
	);
	const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] =
		useState(false);
	const [productToDelete, setProductToDelete] = useState<ProductDto | null>(
		null
	);

	// Use React Query for data
	const { data: vendors = [], isLoading, error } = useVendors();
	const {
		data: products = [],
		isLoading: productsLoading,
		error: productsError,
	} = useProducts();
	const createVendorMutation = useCreateVendor();
	const updateVendorMutation = useUpdateVendor();
	const deleteVendorMutation = useDeleteVendor();
	const createProductMutation = useCreateProduct();
	const updateProductMutation = useUpdateProduct();
	const deleteProductMutation = useDeleteProduct();

	useEffect(() => {
		const isLoggedIn = localStorage.getItem('isLoggedIn');
		const user = localStorage.getItem('currentUser') || 'User';

		if (!isLoggedIn) {
			navigate('/');
			return;
		}

		setCurrentUser(user);
	}, [navigate]);

	const handleAddVendor = async (vendorData: {
		name: string;
		email: string;
	}) => {
		try {
			await createVendorMutation.mutateAsync(vendorData);
			setIsVendorFormOpen(false);
			toast({
				title: 'Success',
				description: 'Vendor created successfully.',
			});
		} catch (error) {
			console.error('Failed to create vendor:', error);
			toast({
				title: 'Error',
				description: 'Failed to create vendor. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleVendorClick = (vendorId: string) => {
		navigate(`/vendor/${vendorId}`);
	};

	const handleEditVendor = (vendor: VendorDto) => {
		setEditingVendor(vendor);
		setIsEditVendorOpen(true);
	};

	const handleUpdateVendor = async (vendorData: UpdateVendorDto) => {
		if (!editingVendor) return;

		try {
			await updateVendorMutation.mutateAsync({
				id: editingVendor.id,
				data: vendorData,
			});
			setIsEditVendorOpen(false);
			setEditingVendor(null);
			toast({
				title: 'Success',
				description: 'Vendor updated successfully.',
			});
		} catch (error) {
			console.error('Failed to update vendor:', error);
			toast({
				title: 'Error',
				description: 'Failed to update vendor. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleDeleteVendorClick = (vendor: VendorDto) => {
		setVendorToDelete(vendor);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteVendor = async () => {
		if (!vendorToDelete) return;

		try {
			setDeletingVendorId(vendorToDelete.id);
			await deleteVendorMutation.mutateAsync(vendorToDelete.id);
			toast({
				title: 'Success',
				description: 'Vendor deleted successfully.',
			});
			setIsDeleteDialogOpen(false);
			setVendorToDelete(null);
		} catch (error) {
			console.error('Failed to delete vendor:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete vendor. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setDeletingVendorId(null);
		}
	};

	const handleCloseDeleteDialog = () => {
		setIsDeleteDialogOpen(false);
		setVendorToDelete(null);
	};

	// Product handlers
	const handleAddProduct = async (productData: CreateProductDto) => {
		try {
			await createProductMutation.mutateAsync(productData);
			setIsProductFormOpen(false);
			toast({
				title: 'Success',
				description: 'Product created successfully.',
			});
		} catch (error) {
			console.error('Failed to create product:', error);
			toast({
				title: 'Error',
				description: 'Failed to create product. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleProductClick = (productId: string) => {
		navigate(`/product/${productId}`);
	};

	const handleEditProduct = (product: ProductDto) => {
		setEditingProduct(product);
		setIsEditProductOpen(true);
	};

	const handleUpdateProduct = async (productData: UpdateProductDto) => {
		if (!editingProduct) return;

		try {
			await updateProductMutation.mutateAsync({
				id: editingProduct.id,
				data: productData,
			});
			setIsEditProductOpen(false);
			setEditingProduct(null);
			toast({
				title: 'Success',
				description: 'Product updated successfully.',
			});
		} catch (error) {
			console.error('Failed to update product:', error);
			toast({
				title: 'Error',
				description: 'Failed to update product. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleDeleteProductClick = (product: ProductDto) => {
		setProductToDelete(product);
		setIsDeleteProductDialogOpen(true);
	};

	const handleDeleteProduct = async () => {
		if (!productToDelete) return;

		try {
			setDeletingProductId(productToDelete.id);
			await deleteProductMutation.mutateAsync(productToDelete.id);
			toast({
				title: 'Success',
				description: 'Product deleted successfully.',
			});
			setIsDeleteProductDialogOpen(false);
			setProductToDelete(null);
		} catch (error) {
			console.error('Failed to delete product:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete product. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setDeletingProductId(null);
		}
	};

	const handleCloseDeleteProductDialog = () => {
		setIsDeleteProductDialogOpen(false);
		setProductToDelete(null);
	};

	return (
		<div className="min-h-screen bg-gray-50/50">
			<Navbar currentUser={currentUser} />

			<div className="max-w-7xl mx-auto px-8 sm:px-12 py-16">
				{/* Header */}
				<div className="mb-16 animate-fade-in-up">
					<h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">
						Dashboard
					</h1>
					<p className="text-xl text-gray-600">
						Monitor your vendor performance and manage products
					</p>
				</div>

				{/* Stats Cards */}
				{/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up animate-delay-100">
					<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300 hover:-translate-y-1">
						<CardContent className="p-8">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-600">
										Total Vendors
									</p>
									<p className="text-4xl font-semibold text-gray-900">
										{vendors.length}
									</p>
								</div>
								<div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
									<div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"></div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300 hover:-translate-y-1">
						<CardContent className="p-8">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-600">
										Total Products
									</p>
									<p className="text-4xl font-semibold text-gray-900">
										{productsLoading ? '—' : products.length}
									</p>
								</div>
								<div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
									<div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg"></div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300 hover:-translate-y-1">
						<CardContent className="p-8">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-600">
										Performance
									</p>
									<p className="text-4xl font-semibold text-gray-900">85%</p>
								</div>
								<div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
									<div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg"></div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div> */}

				{/* Charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-fade-in-up animate-delay-200">
					<VendorDistributionChart />
					<VendorRatingsChart />
				</div>

				{/* Vendors Section */}
				<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl animate-fade-in-up animate-delay-300">
					<CardHeader className="border-b border-gray-200/60 bg-white/90 backdrop-blur-sm rounded-t-2xl">
						<div className="flex flex-row items-center justify-between p-8">
							<div className="space-y-2">
								<CardTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
									Vendors
								</CardTitle>
								<CardDescription className="text-gray-600 text-lg">
									Manage your vendor relationships
								</CardDescription>
							</div>
							<Button
								onClick={() => setIsVendorFormOpen(true)}
								className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
								disabled={createVendorMutation.isPending}
							>
								{createVendorMutation.isPending ? 'Adding...' : 'Add vendor'}
							</Button>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-hidden">
							{isLoading ? (
								<div className="text-center py-20">
									<div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-6"></div>
									<p className="text-gray-600 text-lg">Loading vendors...</p>
								</div>
							) : error ? (
								<div className="text-center py-20">
									<div className="text-red-600 mb-3 text-lg">
										⚠️ Failed to load vendors
									</div>
									<p className="text-gray-600 mb-3">Error: {error.message}</p>
									<p className="text-sm text-gray-500">
										Make sure the backend is running on http://localhost:5231
									</p>
								</div>
							) : vendors.length === 0 ? (
								<div className="text-center py-20">
									<p className="text-gray-600 mb-3 text-lg">No vendors found</p>
									<p className="text-gray-500">
										Add your first vendor to get started
									</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-gray-200/60 bg-gray-50/80 backdrop-blur-sm">
												<th className="text-left py-5 px-8 font-semibold text-gray-900">
													Vendor Name
												</th>
												<th className="text-left py-5 px-8 font-semibold text-gray-900">
													Email
												</th>
												<th className="text-left py-5 px-8 font-semibold text-gray-900">
													Products
												</th>
												<th className="text-left py-5 px-8 font-semibold text-gray-900">
													Created
												</th>
												<th className="text-left py-5 px-8 font-semibold text-gray-900">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white/90">
											{vendors.map((vendor, index) => (
												<tr
													key={vendor.id}
													className={`border-b border-gray-200/60 hover:bg-gray-50/80 transition-all duration-200 ${
														index === vendors.length - 1 ? 'border-b-0' : ''
													}`}
												>
													<td className="py-6 px-8">
														<div className="font-semibold text-gray-900 text-lg">
															{vendor.name}
														</div>
													</td>
													<td className="py-6 px-8 text-gray-600">
														{vendor.email}
													</td>
													<td className="py-6 px-8 text-gray-600">
														<span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
															{vendor.productCount}
														</span>
													</td>
													<td className="py-6 px-8 text-gray-600">
														{new Date(vendor.createdAt).toLocaleDateString()}
													</td>
													<td className="py-6 px-8">
														<div className="flex gap-3">
															<Button
																onClick={() => handleVendorClick(vendor.id)}
																variant="outline"
																size="sm"
																className="border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg px-4 py-2 font-medium transition-all duration-200"
															>
																View
															</Button>
															<Button
																onClick={() => handleEditVendor(vendor)}
																variant="outline"
																size="sm"
																className="border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg px-4 py-2 font-medium transition-all duration-200"
																disabled={updateVendorMutation.isPending}
															>
																{updateVendorMutation.isPending &&
																editingVendor?.id === vendor.id
																	? 'Updating...'
																	: 'Edit'}
															</Button>
															<Button
																onClick={() => handleDeleteVendorClick(vendor)}
																variant="outline"
																size="sm"
																className="border-red-200/80 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg px-4 py-2 font-medium transition-all duration-200"
																disabled={deletingVendorId === vendor.id}
															>
																{deletingVendorId === vendor.id
																	? 'Deleting...'
																	: 'Delete'}
															</Button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<VendorForm
				isOpen={isVendorFormOpen}
				onClose={() => setIsVendorFormOpen(false)}
				onSubmit={handleAddVendor}
				submitText={createVendorMutation.isPending ? 'Adding...' : 'Add Vendor'}
				isLoading={createVendorMutation.isPending}
			/>

			{/* Edit Vendor Form */}
			<VendorForm
				isOpen={isEditVendorOpen}
				onClose={() => {
					setIsEditVendorOpen(false);
					setEditingVendor(null);
				}}
				onSubmit={handleUpdateVendor}
				initialData={
					editingVendor
						? { name: editingVendor.name, email: editingVendor.email }
						: undefined
				}
				title="Edit Vendor"
				submitText={
					updateVendorMutation.isPending ? 'Updating...' : 'Update Vendor'
				}
				isLoading={updateVendorMutation.isPending}
			/>

			{/* Edit Product Form */}
			<ProductForm
				isOpen={isEditProductOpen}
				onClose={() => {
					setIsEditProductOpen(false);
					setEditingProduct(null);
				}}
				onSubmit={handleUpdateProduct}
				initialData={
					editingProduct
						? {
								name: editingProduct.name,
								description: editingProduct.description,
								vendorId: editingProduct.vendorId,
						  }
						: undefined
				}
				title="Edit Product"
				submitText={
					updateProductMutation.isPending ? 'Updating...' : 'Update Product'
				}
				isLoading={updateProductMutation.isPending}
				isEdit={true}
			/>

			{/* Delete Vendor Confirmation Dialog */}
			<ConfirmDialog
				isOpen={isDeleteDialogOpen}
				onClose={handleCloseDeleteDialog}
				onConfirm={handleDeleteVendor}
				title="Delete Vendor"
				description={`Are you sure you want to delete "${vendorToDelete?.name}"? This action cannot be undone and will remove all associated data.`}
				confirmText="Delete"
				cancelText="Cancel"
				variant="destructive"
				isLoading={deletingVendorId === vendorToDelete?.id}
			/>

			{/* Delete Product Confirmation Dialog */}
			<ConfirmDialog
				isOpen={isDeleteProductDialogOpen}
				onClose={handleCloseDeleteProductDialog}
				onConfirm={handleDeleteProduct}
				title="Delete Product"
				description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone and will remove all associated data.`}
				confirmText="Delete"
				cancelText="Cancel"
				variant="destructive"
				isLoading={deletingProductId === productToDelete?.id}
			/>
		</div>
	);
};

export default Dashboard;
