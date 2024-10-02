import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		watch: {
			usePolling: true,
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler', // or "modern"
			},
		},
	},
	plugins: [
		AutoImport({
			dts: true,
			eslintrc: {
				enabled: true,
			},
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue$/,
				/\.vue\?vue/, // .vue
				/\.md$/, // .md
			],
			imports: [
				'vue',
				'vue-router',
				{
					'naive-ui': ['useDialog', 'useNotification', 'useLoadingBar'],
				},
			],
		}),
		Components({
			resolvers: [
				NaiveUiResolver({
					transform: 'PascalCase',
				}),
				ElementPlusResolver(),
			],
		}),
		vue(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
})
