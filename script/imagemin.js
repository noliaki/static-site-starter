const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')

const srcPath = require('./config').src
const distPath = require('./config').dist

const images = glob.sync(`${srcPath}/**/*.{jpg,gif,png,svg}`)

images.forEach(image => {
  imageCompress({
    src: [image],
    dist: path.resolve(distPath, path.relative(srcPath, path.dirname(image)))
  })
})

function imageCompress ({src = images, dist = distPath} = {}) {
  imagemin(src, dist, {
    plugins: [
      imageminSvgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
    ]
  }).then(files => {
    files.forEach(file => {
      console.log(`compress: ${path.relative(distPath, file.path)}`)
    })
  }, error => {
    throw new Error(error)
  })
}

module.exports = imageCompress
