const webpack = require('webpack')
const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]
const docRoot = require('./config').docroot
const distDir = require('./config').dist
const srcDir = require('./config').src

const config = {
  context: docRoot,
  entry: {
    './js/index': './ts/index.ts'
  },
  output: {
    path: distDir,
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@': `${srcDir}/modules/ts`
    },
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    })
  ])
}

if (process.env.NODE_ENV === 'development') {
  config.watch = true
  config.cache = true
  config.devtool = 'source-map'
  config.plugins = plugins.concat([
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ])
}

module.exports = config
