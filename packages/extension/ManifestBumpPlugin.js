const path = require('path')

class ManifestBumpPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('GenerateFilePlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'GenerateFilePlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        async (assets) => {
          try {
            const packageJson = require(
              path.resolve(compiler.context, 'package.json')
            )
            const jsonData = require(
              path.resolve(compiler.context, 'public/manifest.json')
            )

            jsonData['version'] = packageJson.version

            const content = JSON.stringify(jsonData, null, 2)

            assets['manifest.json'] = {
              source: () => content,
              size: () => content.length
            }
          } catch (error) {
            compilation.errors.push(
              new Error(`GenerateManifestPlugin: ${error.message}`)
            )
          }
        }
      )
    })
  }
}

module.exports = ManifestBumpPlugin
