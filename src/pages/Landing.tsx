import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/ui/login-form';

const Landing = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (credentials: {
		username: string;
		password: string;
	}) => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			// Simple validation - in real app, this would be API call
			if (
				credentials.username === 'admin' &&
				credentials.password === 'password'
			) {
				localStorage.setItem('isLoggedIn', 'true');
				localStorage.setItem('currentUser', credentials.username);
				navigate('/dashboard');
			} else {
				alert('Invalid credentials. Use admin/password for demo.');
			}
			setIsLoading(false);
		}, 1000);
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="absolute top-0 left-0 right-0 z-10 animate-fade-in">
				<div className="max-w-7xl mx-auto px-8 sm:px-12">
					<div className="flex items-center justify-between h-20">
						<div className="flex items-center">
							<h1 className="text-xl font-semibold text-gray-900">
								Vendor Management
							</h1>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="pt-20">
				<div className="max-w-7xl mx-auto px-8 sm:px-12">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[calc(100vh-5rem)]">
						{/* Left side - Brand and description */}
						<div className="max-w-2xl animate-fade-in-up">
							<div className="space-y-8">
								<h2 className="text-6xl sm:text-7xl font-semibold text-gray-900 tracking-tight leading-[1.1]">
									Vendor management
									<br />
									<span className="text-primary">infrastructure</span>
								</h2>

								<p className="text-xl text-gray-600 leading-relaxed max-w-lg">
									Manage vendors with confidence. Track products, measure
									performance, and make smarter decisions with our comprehensive
									vendor management platform.
								</p>
							</div>

							{/* Feature highlights */}
							<div className="space-y-8 mt-10  animate-fade-in-up animate-delay-100">
								<div className="flex items-start space-x-5">
									<div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
									<div className="space-y-2">
										<h3 className="font-semibold text-gray-900 text-lg">
											Comprehensive tracking
										</h3>
										<p className="text-gray-600 leading-relaxed">
											Monitor vendor performance and product quality in
											real-time with advanced analytics
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-5">
									<div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
									<div className="space-y-2">
										<h3 className="font-semibold text-gray-900 text-lg">
											Data-driven insights
										</h3>
										<p className="text-gray-600 leading-relaxed">
											Make informed decisions with detailed analytics and
											comprehensive reporting
										</p>
									</div>
								</div>
								<div className="flex items-start space-x-5">
									<div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
									<div className="space-y-2">
										<h3 className="font-semibold text-gray-900 text-lg">
											Streamlined workflows
										</h3>
										<p className="text-gray-600 leading-relaxed">
											Automate vendor onboarding and management processes with
											intelligent workflows
										</p>
									</div>
								</div>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-2 gap-12 mt-16 animate-fade-in-up animate-delay-200">
								<div className="space-y-2">
									<div className="text-4xl font-semibold text-gray-900">
										150+
									</div>
									<div className="text-sm text-gray-600 font-medium">
										Active products
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-4xl font-semibold text-gray-900">
										50+
									</div>
									<div className="text-sm text-gray-600 font-medium">
										Trusted vendors
									</div>
								</div>
							</div>
						</div>

						{/* Right side - Login form */}
						<div className="flex justify-center lg:justify-end animate-fade-in-up animate-delay-300">
							<div className="w-full max-w-md">
								<LoginForm onLogin={handleLogin} />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Loading overlay */}
			{isLoading && (
				<div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
					<div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200/60 animate-scale-in">
						<div className="flex items-center space-x-4">
							<div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
							<div className="text-gray-900 font-medium">Signing you in...</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Landing;
