import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  define: {
    'import.meta.env.VITE_RAZORPAY_KEY_ID': JSON.stringify('rzp_test_yTkQHHvZNL1jxL'),
  },
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
