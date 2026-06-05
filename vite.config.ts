import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5174,
        host: '0.0.0.0',
        open: true, // Abrir browser automaticamente
        strictPort: true, // Falhar se 5174 estiver ocupada (evita confusão)
        hmr: {
          overlay: true, // Mostrar erros no browser
          clientPort: 5174, // Porta do cliente HMR
        },
        watch: {
          ignored: ['**/node_modules/**', '**/backend/**', '**/.git/**'],
        },
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:8000',  // porta do backend (ver backend/app/core/config.py → PORT)
            changeOrigin: true,
            secure: false,
            configure: (proxy, _options) => {
              proxy.on('error', (err, _req, _res) => {
                console.log('proxy error', err);
              });
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                // Log do header Authorization para debug
                const authHeader = req.headers['authorization'] || req.headers['Authorization'];
                if (authHeader) {
                  // Em Node, headers podem vir como string[]; ser defensivo para não crashar o dev server.
                  const authValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
                  const tokenPreview = typeof authValue === 'string'
                    ? authValue.substring(0, 30) + '...'
                    : '[non-string]';
                  console.log('[Proxy] Enviando requisição com Authorization:', req.method, req.url, 'Token:', tokenPreview);
                } else {
                  console.log('[Proxy] Enviando requisição SEM Authorization:', req.method, req.url);
                }
              });
              proxy.on('proxyRes', (proxyRes, req, _res) => {
                console.log('[Proxy] Resposta recebida:', proxyRes.statusCode, req.url);
              });
            },
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: false, // Desabilitar sourcemaps em produção
        minify: 'terser',
        rollupOptions: {
          output: {
            manualChunks: undefined
          }
        }
      },
      // Forçar recarregamento completo em desenvolvimento
      optimizeDeps: {
        force: false, // Não forçar re-otimização a cada vez (pode causar crashes)
        include: ['react', 'react-dom', 'lucide-react'],
      },
      // Melhorar estabilidade
      logLevel: 'info',
    };
});
