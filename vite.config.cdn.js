import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import config from './src/core/config'
// import process from 'process'

const atPath = path.resolve(__dirname, './src')
const assetsPath = path.resolve(__dirname, './src/assets')
const corePath = path.resolve(__dirname, './src/core')
const themePath = path.resolve(`src/assets/theme/${config.theme}.less`)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), svgLoader()],
  resolve: {
    alias: {
      // 设置别名
      '@': atPath,
      '@assets': assetsPath,
      '@core': corePath
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${themePath}"`
        }
      }
    }
  },
  build: {
    outDir: 'cdn',
    lib: {
      entry: path.resolve(__dirname, './src/export.js'),
      formats: ['umd'],
      name: 'CoinScene'
    },
    // terserOptions
    // rollupOptions: {
    //   // 请确保外部化那些你的库中不需要的依赖
    //   external: ['vue'],
    //   output: {
    //     // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
    //     globals: {
    //       Vue: 'Vue'
    //     }
    //   }
    // },
    sourcemap: false
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
