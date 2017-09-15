const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')

const docRoot = require('./config').docroot
const dist = require('./config').dist

const isImage = /(\.(jpg|jpeg|gif|png|svg))$/i

const compressImage = filename => {
  const distPath = path.resolve(dist, path.relative(docRoot, path.dirname(filename)))

  imagemin([filename], distPath, {
    plugins: [
      imageminSvgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
    ]
  }).then(files => {
    files.forEach(file => {
      console.log(`imagemin compress: ${file.path}`)
    })
  })
}

const exec = () => {
  const files = glob.sync(`${docRoot}/**/*.{jpg,jpeg,gif,png,svg}`, {
    nocase: true,
    nodir: true
  })

  files.forEach(file => {
    compressImage(file)
  })
}

if (process.env.NODE_ENV === 'production') {
  exec()
}

module.exports = {
  exec,
  isImage,
  compressImage
}
