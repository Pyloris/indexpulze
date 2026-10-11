import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.resolve(import.meta.dirname, '..')
  const env = loadEnv(mode, envDir, '')

  const rawApiUrl = env.API_URL || 'http://localhost:8088'
  const apiUrl = (/^https?:\/\//i.test(rawApiUrl) ? rawApiUrl : `http://${rawApiUrl}`).replace(/\/+$/, '')
  const wsUrl = apiUrl.replace(/^http(s?):\/\//i, 'ws$1://')

  return {
    plugins: [react()],
    envDir,
    envPrefix: ['VITE_', 'API_'],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL || `${wsUrl}/ws`),
    },
  }
})
