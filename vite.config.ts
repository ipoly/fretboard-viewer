import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL ? `/${process.env.VITE_BASE_URL}/` : '/',
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    VitePWA({
      registerType: process.env.NODE_ENV === 'production' ? 'autoUpdate' : 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon.svg'],
      manifest: {
        name: 'Guitar Fretboard Viewer',
        short_name: 'Fretboard',
        version: '2.1.0',
        description: 'Interactive guitar fretboard viewer for learning scales and music theory',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'landscape-primary',
        scope: process.env.VITE_BASE_URL ? `/${process.env.VITE_BASE_URL}/` : '/',
        start_url: process.env.VITE_BASE_URL ? `/${process.env.VITE_BASE_URL}/` : '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Exclude source maps from caching in production
        globIgnores: ['**/*.map'],
        // Cache all static assets
        maximumFileSizeToCacheInBytes: 5000000, // 5MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              }
            }
          },
          {
            // Cache application assets with network-first strategy
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          },
          {
            // Cache static assets with cache-first strategy
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ],
        // Clean up old caches
        cleanupOutdatedCaches: true,
        // Skip waiting for new service worker
        skipWaiting: true,
        // Claim clients immediately
        clientsClaim: true,
        // Force update on manifest changes
        navigateFallback: null,
        // Include manifest in precache
        additionalManifestEntries: [
          { url: '/manifest.webmanifest', revision: null }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __GIT_HASH__: JSON.stringify(process.env.VITE_GIT_HASH || 'unknown'),
    // Remove console logs in production
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
  server: {
    port: 3000,
    host: true, // 允许局域网访问
    https: false, // 可以设置为 true 来启用 HTTPS
    // 如果需要 HTTPS，可以取消注释下面的配置
    // https: {
    //   key: './localhost-key.pem',
    //   cert: './localhost.pem'
    // }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          react: ['react', 'react-dom'],
          emotion: ['@emotion/react', '@emotion/styled'],
          zustand: ['zustand'],
          // Music theory utilities in separate chunk
          music: ['./src/utils/music/scales.ts', './src/utils/music/fretboard.ts'],
        },
        // Optimize chunk file names for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Optimize bundle size
    minify: 'esbuild',
    target: 'es2020',
    // Enable compression
    cssCodeSplit: true,
    // Optimize asset handling
    assetsInlineLimit: 4096, // 4kb
    // Report bundle size
    reportCompressedSize: true,
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    // Remove console logs and debugger statements in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})