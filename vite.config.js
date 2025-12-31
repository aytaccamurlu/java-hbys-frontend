// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     // Tarayıcıdaki /api isteklerini arka planda localhost:8080'e yönlendirir
//     proxy: {
//       '/api': {
//         target: 'http://127.0.0.1:8080',
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Proxy kısmını sildik çünkü api.js içinde tam URL kullanıyoruz.
})