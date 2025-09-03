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
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
} from 'recharts';
import {
	useProduct,
	useApproveProduct,
	useUpdateProduct,
	useDeleteProduct,
} from '@/services/productsApi';
import { ProductForm } from '@/components/forms/product-form';
import { AssessmentAnalysisModal } from '@/components/forms/assessment-analysis-modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import type { UpdateProductDto, ApproveProductDto } from '@/types/api';

const ProductDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [currentUser, setCurrentUser] = useState('');
	const [isEditFormOpen, setIsEditFormOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isAssessmentAnalysisOpen, setIsAssessmentAnalysisOpen] =
		useState(false);

	// API hooks
	const { data: product, isLoading, error } = useProduct(id || '');
	const updateProductMutation = useUpdateProduct();
	const approveProductMutation = useApproveProduct();
	const deleteProductMutation = useDeleteProduct();

	// Mock data for charts (could be replaced with real sprint/assessment data later)
	const [sprintRatings] = useState([
		{ sprint: 1, rating: 84 },
		{ sprint: 2, rating: 90 },
		{ sprint: 3, rating: 86 },
		{ sprint: 4, rating: 94 },
		{ sprint: 5, rating: 88 },
	]);

	const performanceData = sprintRatings.map((sprint) => ({
		name: `Sprint ${sprint.sprint}`,
		rating: sprint.rating,
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

	const handleUpdateProduct = async (productData: UpdateProductDto) => {
		if (!product) return;

		try {
			await updateProductMutation.mutateAsync({
				id: product.id,
				data: productData,
			});
			setIsEditFormOpen(false);
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

	const handleApproveProduct = async () => {
		if (!product) return;

		try {
			await approveProductMutation.mutateAsync({
				id: product.id,
				data: { comments: 'Approved from product details page' },
			});
			toast({
				title: 'Success',
				description: 'Product approved successfully.',
			});
		} catch (error) {
			console.error('Failed to approve product:', error);
			toast({
				title: 'Error',
				description: 'Failed to approve product. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleDeleteProduct = async () => {
		if (!product) return;

		try {
			await deleteProductMutation.mutateAsync(product.id);
			toast({
				title: 'Success',
				description: 'Product deleted successfully.',
			});
			navigate('/dashboard');
		} catch (error) {
			console.error('Failed to delete product:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete product. Please try again.',
				variant: 'destructive',
			});
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50/50">
				<Navbar currentUser={currentUser} />
				<div className="max-w-7xl mx-auto px-8 sm:px-12 py-16">
					<div className="text-center py-20">
						<div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-6"></div>
						<p className="text-gray-600 text-lg">Loading product details...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="min-h-screen bg-gray-50/50">
				<Navbar currentUser={currentUser} />
				<div className="max-w-7xl mx-auto px-8 sm:px-12 py-16">
					<div className="text-center py-20">
						<div className="text-red-600 mb-3 text-lg">
							⚠️ Product not found
						</div>
						<p className="text-gray-600 mb-3">
							{error
								? `Error: ${error.message}`
								: 'The requested product could not be found.'}
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
						onClick={() => navigate(`/vendor/${product.vendorId}`)}
						className="mb-6 border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-4 py-2 font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
					>
						← Back to Vendor Details
					</Button>
					<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
						<div className="space-y-4">
							<h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">
								{product.name}
							</h1>
							<div className="space-y-2">
								<p className="text-xl text-gray-600">
									Vendor: {product.vendorName}
								</p>
								<p className="text-gray-600">
									Created: {new Date(product.createdAt).toLocaleDateString()}
								</p>
								<p className="text-gray-600 max-w-2xl leading-relaxed">
									{product.description}
								</p>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:gap-3">
							<Button
								onClick={() => setIsEditFormOpen(true)}
								variant="outline"
								className="border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-4 py-2 font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
								disabled={updateProductMutation.isPending}
							>
								{updateProductMutation.isPending
									? 'Updating...'
									: 'Edit Product'}
							</Button>
							{!product.stage1ApprovedAt && (
								<Button
									onClick={handleApproveProduct}
									className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
									disabled={approveProductMutation.isPending}
								>
									{approveProductMutation.isPending
										? 'Approving...'
										: 'Approve Product'}
								</Button>
							)}
							<Button
								onClick={() => setIsDeleteDialogOpen(true)}
								variant="outline"
								className="border-red-200/80 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl px-4 py-2 font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
								disabled={deleteProductMutation.isPending}
							>
								Delete
							</Button>
						</div>
					</div>

					{/* Status and Approval Info */}
					<div className="mt-8 flex flex-wrap gap-6">
						<div className="text-center">
							<div className="text-sm font-medium text-gray-600 mb-2">
								Status
							</div>
							<span
								className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
									product.stage1ApprovedAt
										? 'bg-green-50/80 text-green-700 border border-green-200/60'
										: 'bg-yellow-50/80 text-yellow-700 border border-yellow-200/60'
								}`}
							>
								{product.stage1ApprovedAt ? 'Approved' : 'Pending Approval'}
							</span>
						</div>
						{product.stage1ApprovedAt && (
							<div className="text-center">
								<div className="text-sm font-medium text-gray-600 mb-2">
									Approved Date
								</div>
								<div className="text-sm font-semibold text-gray-900">
									{new Date(product.stage1ApprovedAt).toLocaleDateString()}
								</div>
							</div>
						)}
						{product.stage1ApprovedByName && (
							<div className="text-center">
								<div className="text-sm font-medium text-gray-600 mb-2">
									Approved By
								</div>
								<div className="text-sm font-semibold text-gray-900">
									{product.stage1ApprovedByName}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Performance Chart */}
				<div className="mb-16 animate-fade-in-up animate-delay-100">
					<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300">
						<CardHeader className="pb-6">
							<CardTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
								Development Performance Tracking
							</CardTitle>
							<CardDescription className="text-gray-600 text-lg">
								Performance ratings across development sprints
							</CardDescription>
						</CardHeader>
						<CardContent className="p-6 pt-0">
							<ResponsiveContainer width="100%" height={350}>
								<LineChart
									data={performanceData}
									margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
								>
									<defs>
										<linearGradient
											id="performanceLineGradient"
											x1="0%"
											y1="0%"
											x2="0%"
											y2="100%"
										>
											<stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
											<stop
												offset="100%"
												stopColor="#3B82F6"
												stopOpacity={0.1}
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
															Rating:{' '}
															<span className="font-semibold text-primary">
																{payload[0].value}%
															</span>
														</p>
													</div>
												);
											}
											return null;
										}}
									/>
									<Line
										type="monotone"
										dataKey="rating"
										stroke="#3B82F6"
										strokeWidth={3}
										fill="url(#performanceLineGradient)"
										dot={{
											fill: '#3B82F6',
											strokeWidth: 3,
											r: 6,
											stroke: '#ffffff',
										}}
										activeDot={{
											r: 8,
											stroke: '#3B82F6',
											strokeWidth: 2,
											fill: '#ffffff',
										}}
									/>
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up animate-delay-200">
					{/* Sprint Ratings Table */}
					<div className="lg:col-span-2">
						<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300">
							<CardHeader className="pb-6">
								<CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
									Development Sprint History
								</CardTitle>
								<CardDescription className="text-gray-600">
									Historical performance data for all development sprints
								</CardDescription>
							</CardHeader>
							<CardContent className="p-0">
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-gray-200/60 bg-gray-50/80 backdrop-blur-sm">
												<th className="text-left py-4 px-6 font-semibold text-gray-900">
													Sprint
												</th>
												<th className="text-left py-4 px-6 font-semibold text-gray-900">
													Rating
												</th>
												<th className="text-left py-4 px-6 font-semibold text-gray-900">
													Status
												</th>
											</tr>
										</thead>
										<tbody className="bg-white/90">
											{sprintRatings.map((sprint, index) => (
												<tr
													key={sprint.sprint}
													className={`border-b border-gray-200/60 hover:bg-gray-50/80 transition-all duration-200 ${
														index === sprintRatings.length - 1
															? 'border-b-0'
															: ''
													}`}
												>
													<td className="py-5 px-6">
														<div className="font-semibold text-gray-900">
															Sprint {sprint.sprint}
														</div>
													</td>
													<td className="py-5 px-6">
														<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50/80 text-blue-700 border border-blue-200/60">
															{sprint.rating}%
														</span>
													</td>
													<td className="py-5 px-6">
														<span className="text-green-600 font-medium text-sm">
															Completed
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Actions Panel */}
					<div className="space-y-8">
						<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300">
							<CardHeader className="pb-6">
								<CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
									Product Actions
								</CardTitle>
								<CardDescription className="text-gray-600">
									Manage product evaluations and assessments
								</CardDescription>
							</CardHeader>
							<CardContent className="p-6 pt-0">
								<Button
									className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
									onClick={() => setIsAssessmentAnalysisOpen(true)}
								>
									Run Assessment Analysis
								</Button>
							</CardContent>
						</Card>

						<Card className="border border-gray-200/60 shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:border-gray-300/60 transition-all duration-300">
							<CardHeader className="pb-6">
								<CardTitle className="text-xl font-semibold text-gray-900 tracking-tight">
									Product Information
								</CardTitle>
							</CardHeader>
							<CardContent className="p-6 pt-0 space-y-4">
								<div className="flex justify-between items-center py-2">
									<span className="text-gray-600 font-medium">Product ID:</span>
									<span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
										{product.id.slice(0, 8)}...
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-gray-600 font-medium">Vendor:</span>
									<span className="font-semibold text-gray-900">
										{product.vendorName}
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-gray-600 font-medium">PDMS:</span>
									<span className="font-semibold text-gray-900">
										Rasheed A. Alhugbani
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-gray-600 font-medium">TDM:</span>
									<span className="font-semibold text-gray-900">
										Khalid M. Alshehri
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-gray-600 font-medium">
										Development:
									</span>
									<span className="font-semibold text-gray-900">
										Abdullah Almeshekah
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-gray-600 font-medium">
										Architecture:
									</span>
									<span className="font-semibold text-gray-900">
										Turki M. Alkahtani
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-gray-600 font-medium">Created:</span>
									<span className="font-semibold text-gray-900">
										{new Date(product.createdAt).toLocaleDateString()}
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-gray-600 font-medium">Status:</span>
									<span
										className={`font-semibold ${
											product.stage1ApprovedAt
												? 'text-green-600'
												: 'text-yellow-600'
										}`}
									>
										{product.stage1ApprovedAt ? 'Approved' : 'Pending'}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Edit Product Form */}
				<ProductForm
					isOpen={isEditFormOpen}
					onClose={() => setIsEditFormOpen(false)}
					onSubmit={handleUpdateProduct}
					initialData={
						product
							? {
									name: product.name,
									description: product.description,
									vendorId: product.vendorId,
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

				{/* Delete Confirmation Dialog */}
				<ConfirmDialog
					isOpen={isDeleteDialogOpen}
					onClose={() => setIsDeleteDialogOpen(false)}
					onConfirm={handleDeleteProduct}
					title="Delete Product"
					description={`Are you sure you want to delete "${product.name}"? This action cannot be undone and will remove all associated data.`}
					confirmText="Delete"
					cancelText="Cancel"
					variant="destructive"
					isLoading={deleteProductMutation.isPending}
				/>

				{/* Assessment Analysis Modal */}
				<AssessmentAnalysisModal
					isOpen={isAssessmentAnalysisOpen}
					onClose={() => setIsAssessmentAnalysisOpen(false)}
					productId={product.id}
					productName={product.name}
				/>
			</div>
		</div>
	);
};

export default ProductDetails;
