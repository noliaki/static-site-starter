const path = require('path')
const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')

const srcPath = path.resolve('./src/docroot/')
const distPath = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.resolve('./dist/')

imageCompress({
  recursive: true
})

function imageCompress ({src = `${srcPath}/**/*.{jpg,gif,png,svg}`, dist = distPath, recursive = false} = {}) {
  imagemin([src], dist, {
    useFolderStructure: recursive,
    removePath: recursive ? srcPath : '',
    plugins: [
      imageminSvgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
    ]
  }).then(files => {
    console.log(files)
  }, error => {
    console.log(error)
  })
}

module.exports = {
  srcPath,
  distPath,
  imageCompress
}
