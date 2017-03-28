const path = require('path')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')

const srcPath = path.resolve('./src/')
const distPath = process.env.NODE_ENV !== 'production' ? path.resolve('./dist-dev/') : path.resolve('./dist/')

imagemin([`${srcPath}/**/*.{jpg,gif,png}`], distPath, {
  useFolderStructure: true,
  removePath: srcPath,
  plugins: [
    imageminMozjpeg(),
    imageminPngquant({quality: '65-80'})
  ]
}).then(files => {
  console.log(files)
}, error => {
  console.log(error)
})
