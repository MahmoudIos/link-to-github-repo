import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import VendorDetails from './pages/VendorDetails';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/vendor/:id" element={<VendorDetails />} />
					<Route path="/product/:id" element={<ProductDetails />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);

export default App;
