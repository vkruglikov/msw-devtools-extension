const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const IS_DEV = process.env.NODE_ENV === 'development'

module.exports = ({
  outputSkipHash = [],
  root,
  html = [],
  plugins = [],
  port,
  wdsClient = true
}) => ({
  mode: IS_DEV ? 'development' : 'production',
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
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        exclude: /\.module\.css$/i
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
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  output: {
    filename: (pathData) => {
      if (outputSkipHash.includes(pathData.chunk.name)) {
        return '[name].js'
      }
      return '[name].[contenthash].js'
    },
    path: path.resolve(root, 'dist'),
    publicPath: process.env.PUBLIC_PATH || '/',
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
      'process.env.PUBLIC_PATH': JSON.stringify(process.env.PUBLIC_PATH || '/'),
      'process.env.WDS_EXTENSION_CLIENT_URL': JSON.stringify(
        `ws://localhost:${port}/ws`
      )
    }),
    ...html.map(
      ({ filename, ...restOptions }) =>
        new HtmlWebpackPlugin({
          ...restOptions,
          filename,
          publicPath: process.env.PUBLIC_PATH || '/',
          scriptLoading: 'blocking',
          template: `src/${filename}`
        })
    ),
    ...plugins
  ],
  performance: {
    hints: false
  }
})
