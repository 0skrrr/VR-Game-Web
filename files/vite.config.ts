import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
            },
        },
        devSourcemap: true,
    },
    build: {
        target: 'es2026',
        sourcemap: true,
    },
    server: {
        proxy: {
            // Any fetch to '/test.php' will be forwarded to your PHP server
            '/test.php': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            }
        }
    }
});