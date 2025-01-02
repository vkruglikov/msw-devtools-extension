const createWebpackConfig = require('../../webpack.common.js')

const IS_DEV = process.env.NODE_ENV === 'development'

module.exports = {
  ...createWebpackConfig({
    root: __dirname,
    port: 8082,
    wdsClient: false
  }),
  entry: {
    background: [
      IS_DEV ? './src/utils/wds-listener.ts' : null,
      './src/background.ts'
    ].filter(Boolean),
    content: './src/content.ts',
    injected: './src/injected.ts',
    popup: [
      IS_DEV ? 'webpack-dev-server/client' : null,
      './src/popup.ts'
    ].filter(Boolean)
  }
}
