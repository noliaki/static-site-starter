const path = require('path')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

const srcPath = path.resolve('./src/docroot')
const distPath = path.resolve(process.env.NODE_ENV === 'production' ? './dist' : './dist-dev')

imagemin([`${srcPath}/**/*.{jpg,gif,png}`], distPath, {
  useFolderStructure: true,
  removePath: srcPath,
  plugins: [
    imageminJpegtran(),
    imageminPngquant({quality: '65-80'})
  ]
}).then(files => {
  console.log(files)
}, error => {
  console.log(error)
})
