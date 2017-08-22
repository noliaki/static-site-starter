const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')
const fs = require('fs')

const srcPath = require('./config').src
const distPath = require('./config').dist

const images = glob.sync(`${srcPath}/**/*.{jpg.jpeg,gif,png,svg}`, {
  nocase: true
})
const promises = []

images.forEach(image => {
  promises.push(
    imageCompress({
      src: [image],
      dist: path.resolve(distPath, path.relative(srcPath, path.dirname(image)))
    })
  )
})

Promise.all(promises).then(resolves => {
  resolves.forEach(resolve => {
    console.log(resolve)
  })

  if (process.env.NODE_ENV !== 'production') {
    watch()
    console.log('Start Watch Images')
  }
}, reason => {
  throw new Error(reason)
})

function imageCompress ({src = images, dist = distPath} = {}) {
  return imagemin(src, dist, {
    plugins: [
      imageminSvgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
    ]
  })
}

function watch () {
  fs.watch(srcPath, { recursive: true }, (eventType, filename) => {
    console.log(filename)
    if (!/(\.(jpg|jpeg|png|gif|svg))$/i.test(filename)) {
      return
    }

    imageCompress({
      src: [path.resolve(srcPath, filename)],
      dist: path.resolve(distPath, path.dirname(filename))
    }).then(files => {
      files.forEach(file => {
        console.log(`compress: ${path.relative(distPath, file.path)}`)
      })
    }, error => {
      throw new Error(error)
    })
  })
}
