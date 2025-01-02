const createWebpackConfig = require('../../webpack.common.js')

module.exports = {
  ...createWebpackConfig({ root: __dirname, port: 8081 }),
  entry: {
    main: './src/index.ts'
  }
}
