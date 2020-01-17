import path from 'path'
import fg from 'fast-glob'
import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import chalk from 'chalk'
import config from '../config'
import { distDir, docRoot } from './util'

const imageExt = '*.{jpg,jpeg,gif,png,svg}'

function optimizeImage(srcFileName: string, dest: string): void {
  imagemin([srcFileName], {
    destination: dest,
    plugins: [
      imageminJpegtran(config.imagemin.jpegtran),
      imageminPngquant(config.imagemin.pngquant),
      imageminSvgo(config.imagemin.svgo)
    ]
  }).then((results: imagemin.Result[]): void => {
    results.forEach((result: imagemin.Result): void => {
      console.log(`${chalk.cyan('[imagemin]')} ${result.destinationPath}`)
    })
  })
}

function compress(fileName: string): void {
  const relPath: string = path.relative(docRoot, fileName)
  const distPath: string = path.join(distDir, relPath)

  optimizeImage(fileName, path.dirname(distPath))
}

export function compressAll(): void {
  const files: string[] = fg
    .sync([`${docRoot}/**/${imageExt}`, `${docRoot}/${imageExt}`])
    .map((filename: string): string => path.dirname(filename))
    .filter(
      (dirname: string, index: number, filesArr: string[]): boolean =>
        filesArr.indexOf(dirname) === index
    )

  files.forEach((file: string): void => compress(path.resolve(file, imageExt)))
}

// const path = require('path')
// const glob = require('fast-glob')
// const imagemin = require('imagemin')
// const imageminJpegtran = require('imagemin-jpegtran')
// const imageminPngquant = require('imagemin-pngquant')
// const imageminSvgo = require('imagemin-svgo')

// const config = require('../config')
// const imageExt = '*.{jpg,jpeg,gif,png,svg}'

// function compress(dirname, filename) {
//   const relPath = path.relative(config.docroot, dirname)
//   const distPath = path.resolve(config.dist, relPath)

//   imagemin([filename || `${dirname}${imageExt}`], distPath, {
//     plugins: [
//       imageminJpegtran(config.imagemin.jpegtran),
//       imageminPngquant(config.imagemin.pngquant),
//       imageminSvgo(config.imagemin.svgo)
//     ]
//   }).then(files => {
//     files.forEach(file => {
//       console.log(`imagemin compress: ${file.path}`)
//     })
//   })
// }

// function compressAll() {
//   const files = glob
//     .sync(
//       [`${config.docroot}/**/${imageExt}`, `${config.docroot}/${imageExt}`],
//       {
//         nodir: true
//       }
//     )
//     .map(filename => path.dirname(filename))
//     .filter((dirname, index, filesArr) => filesArr.indexOf(dirname) === index)

//   files.forEach(file => {
//     compress(path.resolve(file, imageExt))
//   })
// }

// module.exports = {
//   compress,
//   compressAll
// }
