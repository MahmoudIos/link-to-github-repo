import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@/components': path.resolve(__dirname, './src/components'),
			'@/lib': path.resolve(__dirname, './src/lib'),
			'@/hooks': path.resolve(__dirname, './src/hooks'),
			'@/utils': path.resolve(__dirname, './src/lib/utils'),
		},
	},
	server: {
		port: 3000,
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:5231',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
	build: {
		outDir: 'dist',
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom', 'react-router-dom'],
					'ui-vendor': [
						'@radix-ui/react-accordion',
						'@radix-ui/react-dialog',
						'@radix-ui/react-dropdown-menu',
						'@radix-ui/react-select',
						'@radix-ui/react-tabs',
						'@radix-ui/react-toast',
					],
				},
			},
		},
	},
	css: {
		devSourcemap: true,
	},
});
