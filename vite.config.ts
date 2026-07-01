import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const API_TARGET = 'https://escrow-website-backend.onrender.com'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
        configure(proxy) {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['access-control-expose-headers'] =
              'authorization,refreshtoken,Authorization,RefreshToken';
          });
        },
      },
    },
  },
})
