import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [
			react({
				jsxImportSource: '@emotion/react'
			}),
			tsconfigPaths({
				parseNative: false
			}),
			svgrPlugin(),
			{
				name: 'custom-hmr-control',
				handleHotUpdate({ file, server }) {
					if (file.includes('src/app/configs/')) {
						server.ws.send({
							type: 'full-reload'
						});
						return [];
					}
				}
			},
			tailwindcss(),
		],
		build: {
			outDir: 'build'
		},
		server: {
			host: '127.0.0.1',
			open: true,
			strictPort: false,
			port: env.VITE_PORT || 3001,
			proxy: {
				'/api': {
					target: env.VITE_BACKEND_BASE_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		define: {
			'import.meta.env.VITE_PORT': JSON.stringify(process.env.PORT || 3001),
			global: 'window'
		},
		resolve: {
			alias: {
				'@': '/src',
				'@fuse': '/src/@fuse',
				'@history': '/src/@history',
				'@lodash': '/src/@lodash',
				'@mock-api': '/src/@mock-api',
				'@schema': '/src/@schema',
				'app/store': '/src/app/store',
				'app/shared-components': '/src/app/shared-components',
				'app/configs': '/src/app/configs',
				'app/theme-layouts': '/src/app/theme-layouts',
				'app/AppContext': '/src/app/AppContext'
			}
		},
		optimizeDeps: {
			include: [
				'@mui/icons-material',
				'@mui/material',
				'@mui/base',
				'@mui/styles',
				'@mui/system',
				'@mui/utils',
				'@emotion/cache',
				'@emotion/react',
				'@emotion/styled',
				'date-fns',
				'lodash'
			],
			exclude: [],
			esbuildOptions: {
				loader: {
					'.js': 'jsx'
				}
			}
		}
	}
});
