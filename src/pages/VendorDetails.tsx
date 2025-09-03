import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/navigation/navbar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import { useVendor } from '@/services/vendorsApi';
import {
	useProductsByVendor,
	useCreateProduct,
	useUpdateProduct,
	useDeleteProduct,
} from '@/services/productsApi';
import { ProductForm } from '@/components/forms/product-form';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import type {
	ProductDto,
	CreateProductDto,
	UpdateProductDto,
} from '@/types/api';

const VendorDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [currentUser, setCurrentUser] = useState('');

	// Product management state
	const [isProductFormOpen, setIsProductFormOpen] = useState(false);
	const [isEditProductOpen, setIsEditProductOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
	const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] =
		useState(false);
	const [productToDelete, setProductToDelete] = useState<ProductDto | null>(
		null
	);
	const [deletingProductId, setDeletingProductId] = useState<string | null>(
		null
	);

	// API hooks
	const {
		data: vendor,
		isLoading: vendorLoading,
		error: vendorError,
	} = useVendor(id || '');
	const {
		data: products = [],
		isLoading: productsLoading,
		error: productsError,
	} = useProductsByVendor(id || '');
	const createProductMutation = useCreateProduct();
	const updateProductMutation = useUpdateProduct();
	const deleteProductMutation = useDeleteProduct();

	const statusData = [
		{
			name: 'Approved',
			value: products.filter((p) => p.stage1ApprovedAt).length,
			color: '#10B981',
		},
		{
			name: 'Pending',
			value: products.filter((p) => !p.stage1ApprovedAt).length,
			color: '#EF4444',
		},
	];

	// Mock ratings data for chart (could be extended with real assessment data later)
	const ratingsData = products.map((product) => ({
		name: product.name,
		score: Math.floor(Math.random() * 20) + 80, // Mock score between 80-100
	}));

	useEffect(() => {
		const isLoggedIn = localStorage.getItem('isLoggedIn');
		const user = localStorage.getItem('currentUser') || 'User';

		if (!isLoggedIn) {
			navigate('/');
			return;
		}

		setCurrentUser(user);
	}, [navigate]);

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

	// Loading and error states
	if (vendorLoading) {
		return (
			<div className="min-h-screen bg-gray-50/50">
				<Navbar currentUser={currentUser} />
				<div className="max-w-7xl mx-auto px-8 sm:px-12 py-16">
					<div className="text-center py-20">
						<div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-6"></div>
						<p className="text-gray-600 text-lg">Loading vendor details...</p>
					</div>
				</div>
			</div>
		);
	}

	if (vendorError || !vendor) {
		return (
			<div className="min-h-screen bg-gray-50/50">
				<Navbar currentUser={currentUser} />
				<div className="max-w-7xl mx-auto px-8 sm:px-12 py-16">
					<div className="text-center py-20">
						<div className="text-red-600 mb-3 text-lg">⚠️ Vendor not found</div>
						<p className="text-gray-600 mb-3">
							{vendorError
								? `Error: ${vendorError.message}`
								: 'The requested vendor could not be found.'}
						</p>
						<Button
							onClick={() => navigate('/dashboard')}
							className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
						>
							Return to Dashboard
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/50">
			<Navbar currentUser={currentUser} />

			<div className="max-w-7xl mx-auto px-8 sm:px-12 py-16">
				{/* Header */}
				<div className="mb-16 animate-fade-in-up">
					<Button
						variant="outline"
						onClick={() => navigate('/dashboard')}
						className="mb-6 border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-4 py-2 font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
					>
						← Back to Dashboard
					</Button>
					<div className="flex items-end justify-between">
						<div>
							<h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">
								{vendor.name}
							</h1>
							<p className="text-xl text-gray-600">{vendor.email}</p>
						</div>
						<div className="text-right">
							<div className="text-sm font-medium text-gray-600 mb-1">
								Total Products
							</div>
							<div className="text-4xl font-semibold text-gray-900">
								{vendor.productCount}
							</div>
						</div>
					</div>
				</div>

				{/* Charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-fade-in-up animate-delay-100">
					<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300">
						<CardHeader className="pb-6">
							<CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
								Product Status Distribution
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6 pt-0">
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<defs>
										<linearGradient
											id="approvedGradient"
											x1="0%"
											y1="0%"
											x2="100%"
											y2="100%"
										>
											<stop offset="0%" stopColor="#10B981" stopOpacity={1} />
											<stop
												offset="100%"
												stopColor="#10B981"
												stopOpacity={0.8}
											/>
										</linearGradient>
										<linearGradient
											id="pendingGradient"
											x1="0%"
											y1="0%"
											x2="100%"
											y2="100%"
										>
											<stop offset="0%" stopColor="#EF4444" stopOpacity={1} />
											<stop
												offset="100%"
												stopColor="#EF4444"
												stopOpacity={0.8}
											/>
										</linearGradient>
									</defs>
									<Pie
										data={statusData}
										cx="50%"
										cy="50%"
										outerRadius={90}
										innerRadius={35}
										dataKey="value"
										stroke="rgba(255,255,255,0.8)"
										strokeWidth={2}
										label={({ name, value }) =>
											value > 0 ? `${name}: ${value}` : ''
										}
									>
										{statusData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={
													index === 0
														? 'url(#approvedGradient)'
														: 'url(#pendingGradient)'
												}
											/>
										))}
									</Pie>
									<Tooltip
										content={({ active, payload }) => {
											if (active && payload && payload.length) {
												const data = payload[0].payload;
												return (
													<div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200/60">
														<p className="font-semibold text-gray-900 mb-2">
															{data.name}
														</p>
														<p className="text-gray-600">
															<span className="font-medium">{data.value}</span>{' '}
															products
														</p>
													</div>
												);
											}
											return null;
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300">
						<CardHeader className="pb-6">
							<CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
								Product Performance Overview
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6 pt-0">
							<ResponsiveContainer width="100%" height={300}>
								<BarChart
									data={ratingsData}
									margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
								>
									<defs>
										<linearGradient
											id="performanceGradient"
											x1="0%"
											y1="0%"
											x2="0%"
											y2="100%"
										>
											<stop offset="0%" stopColor="#10B981" stopOpacity={1} />
											<stop
												offset="50%"
												stopColor="#10B981"
												stopOpacity={0.8}
											/>
											<stop
												offset="100%"
												stopColor="#10B981"
												stopOpacity={0.6}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="2 4"
										stroke="rgba(156, 163, 175, 0.2)"
										horizontal={true}
										vertical={false}
									/>
									<XAxis
										dataKey="name"
										axisLine={false}
										tickLine={false}
										tick={{
											fontSize: 12,
											fontWeight: 500,
											fill: '#6B7280',
										}}
										angle={-45}
										textAnchor="end"
										height={80}
									/>
									<YAxis
										domain={[75, 100]}
										axisLine={false}
										tickLine={false}
										tick={{
											fontSize: 12,
											fontWeight: 500,
											fill: '#6B7280',
										}}
										tickFormatter={(value) => `${value}%`}
									/>
									<Tooltip
										content={({ active, payload, label }) => {
											if (active && payload && payload.length) {
												return (
													<div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200/60">
														<p className="font-semibold text-gray-900 mb-2">
															{label}
														</p>
														<p className="text-gray-600">
															Score:{' '}
															<span className="font-semibold text-green-600">
																{payload[0].value}%
															</span>
														</p>
													</div>
												);
											}
											return null;
										}}
										cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
									/>
									<Bar
										dataKey="score"
										fill="url(#performanceGradient)"
										name="Performance Score"
										radius={[8, 8, 0, 0]}
										stroke="rgba(255,255,255,0.3)"
										strokeWidth={1}
									/>
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>

				{/* Products Section */}
				<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl animate-fade-in-up animate-delay-200">
					<CardHeader className="border-b border-gray-200/60 bg-white/90 backdrop-blur-sm rounded-t-2xl">
						<div className="flex flex-row items-center justify-between p-8">
							<div className="space-y-2">
								<CardTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
									Products
								</CardTitle>
								<CardDescription className="text-gray-600 text-lg">
									All products for this vendor
								</CardDescription>
							</div>
							<Button
								className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
								onClick={() => setIsProductFormOpen(true)}
								disabled={createProductMutation.isPending}
							>
								{createProductMutation.isPending ? 'Adding...' : 'Add product'}
							</Button>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-hidden">
							{productsLoading ? (
								<div className="text-center py-20">
									<div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-6"></div>
									<p className="text-gray-600 text-lg">Loading products...</p>
								</div>
							) : productsError ? (
								<div className="text-center py-20">
									<div className="text-red-600 mb-3 text-lg">
										⚠️ Failed to load products
									</div>
									<p className="text-gray-600 mb-3">
										Error: {productsError.message}
									</p>
								</div>
							) : products.length === 0 ? (
								<div className="text-center py-20">
									<p className="text-gray-600 mb-3 text-lg">
										No products found
									</p>
									<p className="text-gray-500">
										Add the first product to get started for this vendor
									</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-gray-200/60 bg-gray-50/80 backdrop-blur-sm">
												<th className="text-left py-5 px-8 font-semibold text-gray-900">
													Product Name
												</th>
												<th className="text-left py-5 px-8 font-semibold text-gray-900">
													Description
												</th>
												<th className="text-left py-5 px-8 font-semibold text-gray-900">
													Status
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
											{products.map((product, index) => (
												<tr
													key={product.id}
													className={`border-b border-gray-200/60 hover:bg-gray-50/80 transition-all duration-200 ${
														index === products.length - 1 ? 'border-b-0' : ''
													}`}
												>
													<td className="py-6 px-8">
														<div className="font-semibold text-gray-900 text-lg">
															{product.name}
														</div>
													</td>
													<td className="py-6 px-8 text-gray-600 max-w-xs">
														<div
															className="truncate"
															title={product.description}
														>
															{product.description}
														</div>
													</td>
													<td className="py-6 px-8">
														<span
															className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
																product.stage1ApprovedAt
																	? 'bg-green-50/80 text-green-700 border border-green-200/60'
																	: 'bg-yellow-50/80 text-yellow-700 border border-yellow-200/60'
															}`}
														>
															{product.stage1ApprovedAt
																? 'Approved'
																: 'Pending'}
														</span>
													</td>
													<td className="py-6 px-8 text-gray-600">
														{new Date(product.createdAt).toLocaleDateString()}
													</td>
													<td className="py-6 px-8">
														<div className="flex gap-3">
															<Button
																onClick={() => handleProductClick(product.id)}
																variant="outline"
																size="sm"
																className="border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg px-4 py-2 font-medium transition-all duration-200"
															>
																View
															</Button>
															<Button
																onClick={() => handleEditProduct(product)}
																variant="outline"
																size="sm"
																className="border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg px-4 py-2 font-medium transition-all duration-200"
																disabled={updateProductMutation.isPending}
															>
																{updateProductMutation.isPending &&
																editingProduct?.id === product.id
																	? 'Updating...'
																	: 'Edit'}
															</Button>
															<Button
																onClick={() =>
																	handleDeleteProductClick(product)
																}
																variant="outline"
																size="sm"
																className="border-red-200/80 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg px-4 py-2 font-medium transition-all duration-200"
																disabled={deletingProductId === product.id}
															>
																{deletingProductId === product.id
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

				{/* Product Form */}
				<ProductForm
					isOpen={isProductFormOpen}
					onClose={() => setIsProductFormOpen(false)}
					onSubmit={handleAddProduct}
					initialData={{ name: '', description: '', vendorId: id || '' }}
					submitText={
						createProductMutation.isPending ? 'Adding...' : 'Add Product'
					}
					isLoading={createProductMutation.isPending}
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
		</div>
	);
};

export default VendorDetails;
