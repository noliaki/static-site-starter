const path = require('path')
const webpack = require('webpack')

const conf = {
  context: path.resolve('./src/webroot', 'ts/'),
  entry: {
    index: './index.ts'
  },
  output: {
    path: path.resolve(process.env.DIST_DIR, 'js'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          query: {
            plugins: ['lodash']
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      drop_debugger: true,
      drop_console: true
    })
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
  conf.plugins = [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ]
}


module.exports = conf
