import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'axios': path.resolve(__dirname, './src/mocks/axios.js'),
      '@inertiajs/vue3': path.resolve(__dirname, './src/mocks/inertia.js'),
      'vue3-apexcharts': path.resolve(__dirname, './src/mocks/apexcharts.js')
    }
  }
});
