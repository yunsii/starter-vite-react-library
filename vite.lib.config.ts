import path from 'node:path'

import { mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'

import type { UserConfig } from 'vite'

import baseConfig from './vite.base.config'

// https://vitejs.dev/config/
export default mergeConfig(baseConfig, {
  plugins: [dts()],
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      // inspired from: https://github.com/vitejs/vite/discussions/1736#discussioncomment-2621441
      // preserveModulesRoot: https://rollupjs.org/guide/en/#outputpreservemodulesroot
      output: {
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].mjs',
      },
      external: [/node_modules/, /^node:.*$/],
    },
    target: 'esnext',
  },
} as UserConfig)
