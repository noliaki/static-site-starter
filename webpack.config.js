const path = require('path')
const webpack = require('webpack')
const config = {
  context: path.resolve('./src', 'js/'),
  entry: {
    index: './index.js'
  },
  output: {
    path: path.resolve('./dist', 'js'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:[{
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   "window.jQuery": "jquery"
    // })
  ]
}

if (process.env.NODE_ENV === 'development') {
  config.watch = true
  config.cache = true
  config.devtool = 'source-map'
  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ]
}

module.exports config
