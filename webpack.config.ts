import path from 'path'
import fg from 'fast-glob'
import TerserPlugin from 'terser-webpack-plugin'
import * as webpack from 'webpack'
import config from './config'

console.log(config)

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]

const webpackConfig: webpack.Configuration = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  context: config.docroot,
  entry: entries(),
  output: {
    path: config.dist,
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@': `${config.src}/modules/ts`
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
  plugins,
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production'
          }
        }
      })
    ]
  }
}

function entries() {
  const files = fg.sync(`${config.docroot}/**/*.ts`)
  const entriesObj = {}

  files.forEach(file => {
    const filePath = `./${path.relative(config.docroot, file)}`
    const key = filePath.replace(/\/ts\//g, '/js/').replace(/\.ts$/, '')
    entriesObj[key] = filePath
  })

  return entriesObj
}
export default webpackConfig

// const webpack = require('webpack')
// const path = require('path')
// const glob = require('glob')
// const TerserPlugin = require('terser-webpack-plugin')
// const plugins = [
//   new webpack.DefinePlugin({
//     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
//   })
// ]

// const config = require('./config')

// function entries() {
//   const files = glob.sync(`${config.docroot}/**/*.ts`)
//   const entriesObj = {}
//   files.forEach(file => {
//     const filePath = `./${path.relative(config.docroot, file)}`
//     const key = filePath.replace(/\/ts\//g, '/js/').replace(/\.ts$/, '')
//     entriesObj[key] = filePath
//   })

//   return entriesObj
// }

// const webpackConfig = {
//   mode: process.env.NODE_ENV,
//   context: config.docroot,
//   entry: entries(),
//   output: {
//     path: config.dist,
//     filename: '[name].js'
//   },
//   resolve: {
//     alias: {
//       '@': `${config.src}/modules/ts`
//     },
//     extensions: ['.js', '.ts']
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         loader: 'ts-loader',
//         exclude: /node_modules/
//       }
//     ]
//   },
//   plugins,
//   optimization: {
//     minimizer: [
//       new TerserPlugin({
//         terserOptions: {
//           compress: {
//             drop_console: process.env.NODE_ENV === 'production'
//           }
//         }
//       })
//     ]
//   }
// }

// if (process.env.NODE_ENV === 'development') {
//   webpackConfig.watch = true
//   webpackConfig.cache = true
//   webpackConfig.plugins = plugins.concat([
//     new webpack.LoaderOptionsPlugin({
//       debug: true
//     })
//   ])
// }

// module.exports = webpackConfig
