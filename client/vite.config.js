import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: '0.0.0.0',       // Accept connections from any IP
    port: 5173,            // Default Vite port; you can change it
    strictPort: true       // Optional: force Vite to use this port
  }
})
