import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueJsx from '@vitejs/plugin-vue-jsx'
import html from 'vite-plugin-html'
import path from 'path'
import config from './src/core/config'
// import process from 'process'

const atPath = path.resolve(__dirname, './src')
const assetsPath = path.resolve(__dirname, './src/assets')
const corePath = path.resolve(__dirname, './src/core')
const themePath = path.resolve(`src/assets/theme/${config.theme}.less`)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), svgLoader(), html({
    inject: {
      data: {
        title: config.name + config.version,
        injectScript: '' // <script src="./inject.js"></script>
      }
    },
    minify: true
  })],
  resolve: {
    alias: {
      // 设置别名
      '@': atPath,
      '@assets': assetsPath,
      '@core': corePath
    }
  },
  // open: true, // 自动在浏览器打开
  // .
  // define: config,
  server: {
    port: 5000, // 启动端口
    open: true,
    proxy: {
      // 第一个代理
      '/api': { // 匹配到啥来进行方向代理
        target: 'http://127.0.0.1:8080', // 代理的目标
        rewrite: (path) => path.replace(/^\/api/, '') // 如果不需要api 直接把路径上的api 替换成空
      }
    },
    sourcemap: true
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
    sourcemap: true
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
