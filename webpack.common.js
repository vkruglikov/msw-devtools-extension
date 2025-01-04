const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

const IS_DEV = process.env.NODE_ENV === 'development'

module.exports = ({ root, port, wdsClient = true }) => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      },
      {
        test: /\.(png)$/i,
        type: 'asset/resource'
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
  devtool: IS_DEV ? 'inline-source-map' : false,
  devServer: IS_DEV
    ? {
        port,
        compress: true,
        static: {
          directory: path.join(root, 'dist')
        },
        client: wdsClient ? undefined : false,
        devMiddleware: {
          writeToDisk: true
        }
      }
    : false,
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
      'process.env.WDS_EXTENSION_CLIENT_URL': JSON.stringify(
        `ws://localhost:${port}/ws`
      )
    })
  ],
  performance: {
    hints: false
  }
})
