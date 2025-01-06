const createWebpackConfig = require('../../webpack.common.js')
const ManifestBumpPlugin = require('./ManifestBumpPlugin')

const IS_DEV = process.env.NODE_ENV === 'development'

const entry = (paths) =>
  [
    IS_DEV ? '@msw-devtools/wds-extension-client' : null,
    ...(Array.isArray(paths) ? paths : [paths])
  ].filter(Boolean)

module.exports = {
  ...createWebpackConfig({
    outputSkipHash: ['background', 'content', 'injected'],
    root: __dirname,
    port: 8082,
    wdsClient: false,
    html: [
      {
        filename: 'popup.html',
        chunks: ['popup']
      }
    ],
    plugins: [new ManifestBumpPlugin()]
  }),
  entry: {
    background: entry('./src/background.ts'),
    content: entry('./src/content.ts'),
    injected: entry('./src/injected.ts'),
    popup: entry('./src/popup.ts')
  }
}
