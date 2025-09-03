import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useVendors } from '@/services/vendorsApi';
import type { CreateProductDto, UpdateProductDto } from '@/types/api';

interface ProductFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (product: CreateProductDto | UpdateProductDto) => void;
	initialData?: { name: string; description: string; vendorId?: string };
	title?: string;
	submitText?: string;
	isLoading?: boolean;
	isEdit?: boolean;
}

export const ProductForm = ({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	title = 'Add New Product',
	submitText = 'Add Product',
	isLoading = false,
	isEdit = false,
}: ProductFormProps) => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		vendorId: '',
	});
	const [errors, setErrors] = useState({
		name: '',
		description: '',
		vendorId: '',
	});

	const { data: vendors = [], isLoading: vendorsLoading } = useVendors();

	// Update form data when initialData changes or modal opens
	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				setFormData({
					name: initialData.name,
					description: initialData.description,
					vendorId: initialData.vendorId || '',
				});
			} else {
				setFormData({ name: '', description: '', vendorId: '' });
			}
			setErrors({ name: '', description: '', vendorId: '' });
		}
	}, [isOpen, initialData]);

	const validateForm = () => {
		const newErrors = { name: '', description: '', vendorId: '' };

		if (!formData.name.trim()) {
			newErrors.name = 'Product name is required';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Description is required';
		}

		if (!isEdit && !formData.vendorId) {
			newErrors.vendorId = 'Vendor selection is required';
		}

		setErrors(newErrors);
		return (
			!newErrors.name &&
			!newErrors.description &&
			(isEdit || !newErrors.vendorId)
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			if (isEdit) {
				// For edit, only send name and description
				onSubmit({
					name: formData.name,
					description: formData.description,
				} as UpdateProductDto);
			} else {
				// For create, send all fields including vendorId
				onSubmit({
					name: formData.name,
					description: formData.description,
					vendorId: formData.vendorId,
				} as CreateProductDto);
			}
		}
	};

	const handleClose = () => {
		setFormData({ name: '', description: '', vendorId: '' });
		setErrors({ name: '', description: '', vendorId: '' });
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{initialData
							? 'Update the product information below.'
							: 'Enter the product information below to add it to your tracking system.'}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="productName">Product Name</Label>
						<Input
							id="productName"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="Enter product name"
							className={errors.name ? 'border-red-500' : ''}
						/>
						{errors.name && (
							<p className="text-red-500 text-xs">{errors.name}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="productDescription">Description</Label>
						<Textarea
							id="productDescription"
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="Enter product description"
							className={errors.description ? 'border-red-500' : ''}
							rows={3}
						/>
						{errors.description && (
							<p className="text-red-500 text-xs">{errors.description}</p>
						)}
					</div>

					{!isEdit && (
						<div className="space-y-2">
							<Label htmlFor="vendorSelect">Vendor</Label>
							<Select
								value={formData.vendorId}
								disabled={initialData.vendorId ? true : false}
								onValueChange={(value) =>
									setFormData({ ...formData, vendorId: value })
								}
							>
								<SelectTrigger
									className={errors.vendorId ? 'border-red-500' : ''}
								>
									<SelectValue placeholder="Select a vendor" />
								</SelectTrigger>
								<SelectContent>
									{vendorsLoading ? (
										<SelectItem value="" disabled>
											Loading vendors...
										</SelectItem>
									) : vendors.length === 0 ? (
										<SelectItem value="" disabled>
											No vendors available
										</SelectItem>
									) : (
										vendors.map((vendor) => (
											<SelectItem key={vendor.id} value={vendor.id}>
												{vendor.name}
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
							{errors.vendorId && (
								<p className="text-red-500 text-xs">{errors.vendorId}</p>
							)}
						</div>
					)}

					<div className="flex justify-end space-x-2 pt-4">
						<Button type="button" variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700"
							disabled={isLoading}
						>
							{submitText}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
