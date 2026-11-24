import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import chatHandler from './backend/chat.js'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const frontendRoot = resolve(projectRoot, 'frontend')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '')
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY
  if (env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL

  return {
    root: frontendRoot,
    envDir: projectRoot,
    server: {
      fs: {
        allow: [projectRoot],
      },
    },
    build: {
      outDir: resolve(projectRoot, 'dist'),
      emptyOutDir: true,
    },
    plugins: [
      react(),
      {
        name: 'portfolio-ai-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', (req, res) => {
            chatHandler(req, res).catch((error) => {
              console.error('Portfolio chat request failed:', error)
              if (res.headersSent) return
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify({ error: 'The chat could not process that request.' }))
            })
          })
        },
      },
    ],
  }
})
