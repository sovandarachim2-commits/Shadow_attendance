import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const frontendDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(frontendDir, '..')

/** When HTTPS is on 5174, listen on 5173 and redirect http://…:5173 → https://…:5174 */
function httpToHttpsRedirectPlugin(httpsPort, lanIp = '') {
  return {
    name: 'http-to-https-redirect',
    configureServer() {
      const redirectPort = httpsPort === 5174 ? 5173 : httpsPort - 1
      const server = http.createServer((req, res) => {
        const host = (req.headers.host || `localhost:${httpsPort}`).replace(/:\d+$/, '')
        const target = `https://${host}:${httpsPort}${req.url || '/'}`
        res.writeHead(302, { Location: target, 'Content-Type': 'text/html; charset=utf-8' })
        res.end(
          `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${target}"></head>`
          + `<body><p>Redirecting to <a href="${target}">${target}</a></p></body></html>`,
        )
      })
      server.listen(redirectPort, '0.0.0.0', () => {
        const lan = lanIp ? `http://${lanIp}:${redirectPort}` : null
        // eslint-disable-next-line no-console
        console.log(`  HTTP redirect: http://localhost:${redirectPort} → https://localhost:${httpsPort}`)
        if (lan) {
          // eslint-disable-next-line no-console
          console.log(`  HTTP redirect: ${lan} → https://${lanIp}:${httpsPort}`)
        }
        // eslint-disable-next-line no-console
        console.log(`  Use HTTPS only: https://localhost:${httpsPort} (http://${lanIp || 'localhost'}:${httpsPort} = blank page)`)
      })
      return () => server.close()
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')
  const certPath = path.join(frontendDir, 'cert.pem')
  const keyPath = path.join(frontendDir, 'key.pem')
  const lanIp = env.DEV_LAN_IP?.trim() || ''
  const hasHttps = env.DEV_HTTPS === 'true' && fs.existsSync(certPath) && fs.existsSync(keyPath)
  const port = 5174

  return {
    envDir: rootDir,
    cacheDir: '../.vite-cache',
    plugins: [
      react(),
      tailwindcss(),
      ...(hasHttps ? [httpToHttpsRedirectPlugin(port, lanIp)] : []),
    ],
    server: {
      host: '0.0.0.0',
      port,
      strictPort: true,
      ...(hasHttps ? {
        https: {
          cert: fs.readFileSync(certPath),
          key: fs.readFileSync(keyPath),
        },
      } : {}),
      hmr: lanIp ? {
        host: lanIp,
        port,
        protocol: hasHttps ? 'wss' : 'ws',
        clientPort: port,
      } : {
        protocol: hasHttps ? 'wss' : 'ws',
        clientPort: port,
      },
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          xfwd: true,
        },
      },
    },
  }
})
