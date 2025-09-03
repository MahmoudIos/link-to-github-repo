import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
	onLogin: (credentials: { username: string; password: string }) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
	const [credentials, setCredentials] = useState({
		username: '',
		password: '',
	});
	const [errors, setErrors] = useState({ username: '', password: '' });

	const validateForm = () => {
		const newErrors = { username: '', password: '' };

		if (!credentials.username.trim()) {
			newErrors.username = 'Username is required';
		}

		if (!credentials.password.trim()) {
			newErrors.password = 'Password is required';
		}

		setErrors(newErrors);
		return !newErrors.username && !newErrors.password;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onLogin(credentials);
		}
	};

	return (
		<Card className="w-full border border-gray-200/60 shadow-xl bg-white/95 backdrop-blur-md rounded-2xl hover:shadow-2xl transition-all duration-300">
			<CardHeader className="space-y-3 pb-8 pt-8">
				<CardTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
					Sign in to your account
				</CardTitle>
				<CardDescription className="text-gray-600 leading-relaxed">
					Enter your credentials to access the vendor management system
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-8 pb-8">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-3">
						<Label
							htmlFor="username"
							className="text-sm font-medium text-gray-900"
						>
							Username
						</Label>
						<Input
							id="username"
							type="text"
							placeholder="Enter your username"
							value={credentials.username}
							onChange={(e) =>
								setCredentials({ ...credentials, username: e.target.value })
							}
							className={`h-12 px-4 border-gray-200/80 focus:border-primary/60 focus:ring-primary/20 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-200 placeholder:text-gray-400 ${
								errors.username
									? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
									: ''
							}`}
						/>
						{errors.username && (
							<p className="text-sm text-red-600 animate-fade-in">
								{errors.username}
							</p>
						)}
					</div>

					<div className="space-y-3">
						<Label
							htmlFor="password"
							className="text-sm font-medium text-gray-900"
						>
							Password
						</Label>
						<Input
							id="password"
							type="password"
							placeholder="Enter your password"
							value={credentials.password}
							onChange={(e) =>
								setCredentials({ ...credentials, password: e.target.value })
							}
							className={`h-12 px-4 border-gray-200/80 focus:border-primary/60 focus:ring-primary/20 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-200 placeholder:text-gray-400 ${
								errors.password
									? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
									: ''
							}`}
						/>
						{errors.password && (
							<p className="text-sm text-red-600 animate-fade-in">
								{errors.password}
							</p>
						)}
					</div>

					<Button
						type="submit"
						className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
					>
						Sign in
					</Button>
				</form>

				{/* Demo credentials hint */}
				<div className="pt-6 border-t border-gray-200/60">
					<div className="bg-gray-50/80 rounded-xl p-4 backdrop-blur-sm">
						<p className="text-xs text-gray-600 text-center font-medium">
							Demo credentials:{' '}
							<span className="font-mono bg-white px-2 py-1 rounded text-gray-900">
								admin
							</span>{' '}
							/{' '}
							<span className="font-mono bg-white px-2 py-1 rounded text-gray-900">
								password
							</span>
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
