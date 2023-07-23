import path from 'path'

import { mergeConfig } from 'vite'
import pages, {
  DefaultPageStrategy,
  extractStaticData,
} from 'vite-plugin-react-pages'
import { kebabCase } from 'lodash-es'

import baseConfig from './vite.base.config'

import type { UserConfig } from 'vite'

function getPagePublicPath(relativePageFilePath: string) {
  let pagePublicPath = relativePageFilePath.replace(
    /\$\.(md|mdx|js|jsx|ts|tsx)$/,
    '',
  )
  pagePublicPath = pagePublicPath.replace(/index$/, '')
  // remove trailing slash
  pagePublicPath = pagePublicPath.replace(/\/$/, '')
  // ensure starting slash
  pagePublicPath = pagePublicPath.replace(/^\//, '')
  pagePublicPath = `/${pagePublicPath}`

  // turn [id] into :id
  // so that react-router can recognize it as url params
  pagePublicPath = pagePublicPath.replace(
    /\[(.*?)\]/g,
    (_, paramName) => `:${paramName}`,
  )

  return pagePublicPath
}

// https://vitejs.dev/config/
export default mergeConfig(baseConfig, {
  plugins: [
    pages({
      pagesDir: path.join(__dirname, 'docs/pages'),
      pageStrategy: new DefaultPageStrategy({
        extraFindPages: async (pagesDir, helpers) => {
          const srcPath = path.join(__dirname, './src')
          // show all component demos
          helpers.watchFiles(
            srcPath,
            '**/demos/**/*.{[tj]sx,md?(x)}',
            async (file, api) => {
              const { relative, path: absolute } = file
              const match = relative.match(/(.*)\/demos\/(.*)\.([tj]sx|mdx?)$/)
              if (!match) {
                throw new Error(`unexpected file: ${absolute}`)
              }
              let [, componentName, demoName] = match
              componentName = transformComponentName(componentName)
              const pageId = `/${componentName}`
              // set page data
              const runtimeDataPaths = api.getRuntimeData(pageId)
              // the ?demo query will wrap the module with useful demoInfo
              runtimeDataPaths[demoName] = `${absolute}?demo`
            },
          )

          // find all component README
          helpers.watchFiles(srcPath, '**/README.md?(x)', async (file, api) => {
            const { relative, path: absolute } = file
            const match = relative.match(/(.*)\/README\.mdx?$/)
            if (!match) {
              throw new Error(`unexpected file: ${absolute}`)
            }
            let [, componentName] = match
            componentName = transformComponentName(componentName)
            const pageId = `/${componentName}`
            // set page data
            const runtimeDataPaths = api.getRuntimeData(pageId)
            runtimeDataPaths.main = absolute
            // set page staticData
            const staticData = api.getStaticData(pageId)
            staticData.main = await helpers.extractStaticData(file)
          })
        },
        fileHandler: async (file, fileHandlerAPI) => {
          const pagePublicPath = getPagePublicPath(file.relative)
          fileHandlerAPI.addPageData({
            pageId: pagePublicPath,
            dataPath: file.path,
            staticData: await extractStaticData(file),
          })
        },
      }),
    }),
  ],
  build: {
    outDir: 'dist-docs',
  },
} as UserConfig)

/**
 * trun "components/ButtonGroup" to `components/button-group`
 * but don't process hooks/useConsole
 */
function transformComponentName(componentPath: string) {
  if (!componentPath.startsWith('components/')) {
    return componentPath
  }
  const splits = componentPath.split('/')
  const lastIndex = splits.length - 1
  splits[lastIndex] = kebabCase(splits[lastIndex])
  return splits.join('/')
}
