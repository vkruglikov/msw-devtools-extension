const createWebpackConfig = require('../../webpack.common.js')

module.exports = {
  ...createWebpackConfig({
    html: [
      {
        filename: 'index.html'
      }
    ],
    root: __dirname,
    port: 8081
  }),
  entry: {
    index: './src/index.ts'
  }
}
