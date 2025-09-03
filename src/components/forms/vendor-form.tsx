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

interface VendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vendor: { name: string; email: string }) => void;
  initialData?: { name: string; email: string };
  title?: string;
  submitText?: string;
  isLoading?: boolean;
}

export const VendorForm = ({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	title = 'Add New Vendor',
	submitText = 'Add Vendor',
	isLoading = false,
}: VendorFormProps) => {
	const [formData, setFormData] = useState({ name: '', email: '' });
	const [errors, setErrors] = useState({ name: '', email: '' });

	// Update form data when initialData changes or modal opens
	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				setFormData(initialData);
			} else {
				setFormData({ name: '', email: '' });
			}
			setErrors({ name: '', email: '' });
		}
	}, [isOpen, initialData]);

	const validateForm = () => {
		const newErrors = { name: '', email: '' };

		if (!formData.name.trim()) {
			newErrors.name = 'Vendor name is required';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Please enter a valid email';
		}

		setErrors(newErrors);
		return !newErrors.name && !newErrors.email;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
			// Don't clear form here - let parent component handle it
		}
	};

	const handleClose = () => {
		setFormData({ name: '', email: '' });
		setErrors({ name: '', email: '' });
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{initialData
							? 'Update the vendor information below.'
							: 'Enter the vendor information below to add them to your tracking system.'}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="vendorName">Vendor Name</Label>
						<Input
							id="vendorName"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="Enter vendor name"
							className={errors.name ? 'border-red-500' : ''}
						/>
						{errors.name && (
							<p className="text-red-500 text-xs">{errors.name}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="vendorEmail">Vendor Email</Label>
						<Input
							id="vendorEmail"
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							placeholder="Enter vendor email"
							className={errors.email ? 'border-red-500' : ''}
						/>
						{errors.email && (
							<p className="text-red-500 text-xs">{errors.email}</p>
						)}
					</div>

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
