const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')

const paths = require('./paths')
const isImage = require('./util').isImage

const config = require('../config').imagemin

const compressImage = filename => {
  const distPath = path.resolve(paths.dist, path.relative(paths.docroot, path.dirname(filename)))

  imagemin([filename], distPath, {
    plugins: [
      imageminJpegtran(config.jpegtran),
      imageminPngquant(config.pngquant),
      imageminSvgo(config.svgo)
    ]
  }).then(files => {
    files.forEach(file => {
      console.log(`imagemin compress: ${file.path}`)
    })
  })
}
exports.compressImage = compressImage

const exec = () => {
  const files = glob.sync(`${paths.docroot}/**/*.{jpg,jpeg,gif,png,svg}`, {
    nodir: true
  }).filter(file => isImage.test(file))

  files.forEach(file => {
    compressImage(file)
  })
}
exports.exec = exec
