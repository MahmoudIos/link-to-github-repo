import axios, { AxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';

const options: AxiosRequestConfig = {
	baseURL: import.meta.env.DEV
		? '/api' // Use proxy in development
		: import.meta.env.VITE_API_BASE_URL || 'API',
};

export const useApi = () => {
	const navigate = useNavigate();
	const apiPublic = axios.create(options);
	const apiPrivate = axios.create(options);

	// Add a request interceptor
	apiPrivate.interceptors.request.use(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function (config: any) {
			config.headers = {};
			config.headers = {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			};

			return config;
		},
		function (error) {
			// Do something with request error
			console.log(';;;;;;');

			if (
				error?.response?.headers['content-type'].includes('text/html') &&
				error.response.data.toLowerCase().includes('support id')
			) {
				const ticketNumber = error.response.data.replace(/\D+/g, '');
				alert(
					`The requested URL was rejected. Please consult with your administrator. Your support ID is: ${ticketNumber}`
				);
			}

			return Promise.reject(error);
		}
	);

	// Add a response interceptor
	apiPrivate.interceptors.response.use(
		function (response) {
			// Any status code that lie within the range of 2xx cause this function to
			// trigger Do something with response data
			return response;
		},
		function (error) {
			if (error?.response?.data?.status === 401) {
				navigate('/login');
			}
			// Any status codes that falls outside the range of 2xx cause this
			// function to trigger Do something with response error
			if (
				error?.response?.headers['content-type'].includes('text/html') &&
				error.response.data.toLowerCase().includes('support id')
			) {
				const ticketNumber = error.response.data.replace(/\D+/g, '');
				alert(
					`The requested URL was rejected. Please consult with your administrator. Your support ID is: ${ticketNumber}`
				);
			}
			return Promise.reject(error);
		}
	);

	return { apiPrivate, apiPublic };
};
