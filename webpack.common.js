const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = ({ root, port, wdsClient = true }) => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.module\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false
              }
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    port,
    compress: true,
    static: {
      directory: path.join(root, 'dist')
    },
    client: wdsClient ? undefined : false,
    devMiddleware: {
      writeToDisk: true
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(root, 'dist'),
    publicPath: '/',
    clean: true
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(root, 'public'), to: path.resolve(root, 'dist') }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.WDS_PORT': JSON.stringify(port)
    })
  ],
  performance: {
    hints: false
  }
})
