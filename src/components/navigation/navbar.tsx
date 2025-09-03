import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
	currentUser?: string;
}

export const Navbar = ({ currentUser }: NavbarProps) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('isLoggedIn');
		navigate('/');
	};

	return (
		<nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-8 sm:px-12">
				<div className="flex justify-between items-center h-20">
					<div className="flex items-center">
						<h1 className="text-xl font-semibold text-gray-900 tracking-tight">
							Vendor Management
						</h1>
					</div>

					<div className="flex items-center space-x-6">
						{currentUser && (
							<>
								<div className="text-gray-600">
									Welcome,{' '}
									<span className="font-semibold text-gray-900">
										{currentUser}
									</span>
								</div>
								<Button
									onClick={handleLogout}
									variant="outline"
									size="sm"
									className="border-gray-200/80 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-4 py-2 font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
								>
									Sign out
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
