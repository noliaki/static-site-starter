const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')

const config = require('../config')
const imageExt = '*.{jpg,jpeg,gif,png,svg}'

const compressImage = (dirname, filename) => {
  const relPath = path.relative(config.docroot, dirname)
  const distPath = path.resolve(config.dist, relPath)

  imagemin([filename || `${dirname}${imageExt}`], distPath, {
    plugins: [
      imageminJpegtran(config.imagemin.jpegtran),
      imageminPngquant(config.imagemin.pngquant),
      imageminSvgo(config.imagemin.svgo)
    ]
  }).then(files => {
    files.forEach(file => {
      console.log(`imagemin compress: ${file.path}`)
    })
  })
}
exports.compressImage = compressImage

const exec = () => {
  const files = glob
    .sync(
      [`${config.docroot}/**/${imageExt}`, `${config.docroot}/${imageExt}`],
      {
        nodir: true
      }
    )
    .map(filename => path.dirname(filename))
    .filter((dirname, index, filesArr) => filesArr.indexOf(dirname) === index)

  files.forEach(file => {
    compressImage(path.resolve(file, imageExt))
  })
}
exports.exec = exec
