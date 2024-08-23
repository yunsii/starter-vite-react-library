import path from 'node:path'

import { mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'

import baseConfig from './vite.base.config'

import type { UserConfig } from 'vite'

// https://vitejs.dev/config/
export default mergeConfig(baseConfig, {
  plugins: [dts({
    exclude: '**/demos',
  })],
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
        entryFileNames: '[name].js',
      },
      // ref: https://github.com/vitejs/vite/issues/4454#issuecomment-1407461535
      // eslint-disable-next-line regexp/no-unused-capturing-group
      external: (source, _, isResolved) => !(isResolved || /(^[./])|(^@\/)/.test(source)),
    },
    target: 'esnext',
  },
} as UserConfig)
