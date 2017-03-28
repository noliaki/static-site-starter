const path = require('path')
const webpack = require('webpack')

const conf = {
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
        use: [{
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

if (process.env.NODE_ENV !== 'production') {
  conf.watch = true
  conf.cache = true
  conf.devtool = 'source-map'
  conf.plugins.push(new webpack.LoaderOptionsPlugin({
    debug: true
  }))
}


module.exports = conf
