const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]
const paths = require('./scripts/paths')

function entries () {
  const files = glob.sync(`${paths.docroot}/**/*.ts`)
  const entriesObj = {}
  files.forEach(file => {
    const filePath = `./${path.relative(paths.docroot, file)}`
    entriesObj[filePath.replace(/\/ts\//g, '/js/').replace(/\.ts$/, '')] = filePath
  })

  return entriesObj
}

const config = {
  context: paths.docroot,
  entry: entries(),
  output: {
    path: paths.dist,
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@': `${paths.src}/modules/ts`
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
