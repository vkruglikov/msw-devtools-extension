![Private](https://img.shields.io/badge/status-private-red?)
## Webpack dev server chrome extension client

Calls `chrome.runtime.reload()` every time the dev server sends a reload message.

### webpack.config.js
```javascript
module.exports = {
  devServer: {
    port: 8082,
    client: false,
    devMiddleware: {
      writeToDisk: true
    }
  },
  entry: {
    background: [
      '@msw-devtools/wds-extension-client',
      './src/background.ts'
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.WDS_EXTENSION_CLIENT_URL': JSON.stringify(
        `ws://localhost:8082/ws`
      )
    })
  ],
}
```