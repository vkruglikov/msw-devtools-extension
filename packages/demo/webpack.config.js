const createWebpackConfig = require('../../webpack.common.js')

module.exports = {
  ...createWebpackConfig({ root: __dirname }),
  entry: {
    main: './src/index.ts'
  }
}
