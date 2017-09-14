const path = require('path')
const glob = require('glob')
const imagemin = require('imagemin')
const imageminSvgo = require('imagemin-svgo')
const fs = require('fs')

const docRoot = require('./config').docroot
const dist = require('./config').dist

const files = glob.sync(`${docRoot}/**/*.{jpg,jpeg,gif,png,svg}`, {
  nocase: true
})
// const promises = []

files.forEach(file => {
  compressImage(file)
})

// Promise.all(promises).then(resolves => {
//   resolves.forEach(resolve => {
//     console.log(resolve)
//   })
// }, reason => {
//   throw new Error(reason)
// })

// function imageCompress ({src = images, dist = dist} = {}) {
//   return imagemin(src, dist, {
//     plugins: [
//       imageminSvgo({
//         plugins: [
//           {removeViewBox: false}
//         ]
//       })
//     ]
//   })
// }

function compressImage (filename) {
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
      console.log(file)
    })
  })
}

// function watch () {
//   fs.watch(docRoot, { recursive: true }, (eventType, filename) => {
//     console.log(filename)
//     if (!/(\.(jpg|jpeg|png|gif|svg))$/i.test(filename)) {
//       return
//     }

//     imageCompress({
//       src: [path.resolve(docRoot, filename)],
//       dist: path.resolve(distPath, path.dirname(filename))
//     }).then(files => {
//       files.forEach(file => {
//         console.log(`compress: ${path.relative(distPath, file.path)}`)
//       })
//     }, error => {
//       throw new Error(error)
//     })
//   })
// }
