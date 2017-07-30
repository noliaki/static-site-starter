const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')

const srcPath = path.resolve(`${__dirname}/../src/docroot`)
const distPath = path.resolve(process.env.DIST_DIR || `${__dirname}../dist-dev`)

const images = glob.sync(`${srcPath}/**/*.{jpg,gif,png,svg}`)

for (let i = 0; i < images.length; i++) {
  imageCompress({
    src: [images[i]],
    dist: path.resolve(distPath, path.relative(srcPath, images[i]))
  })
}

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

module.exports = {
  srcPath,
  distPath,
  imageCompress
}
