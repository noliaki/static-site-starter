const path = require('path')
const imagemin = require('imagemin')
// const imageminMozjpeg = require('imagemin-mozjpeg')
// const imageminPngquant = require('imagemin-pngquant')

const srcPath = path.resolve('./src/webroot/img')
const distPath = path.resolve(process.env.DIST_DIR || 'dist-dev/img')

imagemin([`${srcPath}/**/*.{jpg,gif,png}`], `${distPath}/img`, {
  // plugins: [
  //   imageminMozjpeg(),
  //   imageminPngquant({quality: '65-80'})
  // ]
}).then(files => {
  console.log(files)
}, error => {
  console.log(error)
})
