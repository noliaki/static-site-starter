const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')
const fs = require('fs')

const docRoot = require('./config').docroot
const distPath = require('./config').dist

const images = glob.sync(`${docRoot}/**/*.{jpg,jpeg,gif,png,svg}`, {
  nocase: true
})
const promises = []

images.forEach(image => {
  promises.push(
    imageCompress({
      src: [image],
      dist: path.resolve(distPath, path.relative(docRoot, path.dirname(image)))
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
  fs.watch(docRoot, { recursive: true }, (eventType, filename) => {
    console.log(filename)
    if (!/(\.(jpg|jpeg|png|gif|svg))$/i.test(filename)) {
      return
    }

    imageCompress({
      src: [path.resolve(docRoot, filename)],
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
