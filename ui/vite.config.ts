import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { UserConfigExport, type PluginOption } from 'vite'
import svgLoader from 'vite-svg-loader'

export default ({ command, mode }): UserConfigExport => {
  const plugins: PluginOption[] = [
    vue(),
    vueJsx(),
    svgLoader(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ]
  if (command === 'build') {
    plugins.push(
      visualizer({
        gzipSize: true,
        filename: './dist/stats.html'
      }) as unknown as PluginOption
    )
  }
  return {
    base: mode === 'production' ? (process.env.VITE_APP_ALIAS || '/') : './',
    define: {
      __VUE_OPTIONS_API__: false
    },
    plugins: plugins,
    server: {
      host: '0.0.0.0',
      port: 3089
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    optimizeDeps: {
      include: [
      ]
    }
  }
}
