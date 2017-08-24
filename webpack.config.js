const path = require('path')
const webpack = require('webpack')
const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]
const distDir = process.env.DIST_DIR || './dist'

const config = {
  context: path.resolve('./src/docroot'),
  entry: {
    './js/index': './js/index.js'
  },
  output: {
    path: path.resolve(distDir),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
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
