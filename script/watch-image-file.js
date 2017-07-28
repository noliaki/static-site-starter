const fs = require('fs')
const path = require('path')
const srcPath = require('./imagemin').srcPath
const distPath = require('./imagemin').distPath
const imageCompress = require('./imagemin').imageCompress

fs.watch(srcPath, { recursive: true }, (eventType, filename) => {
  if (!/(\.(jpg|png|gif|svg))$/.test(filename)) {
    return
  }

  imageCompress({
    src: path.resolve(srcPath, filename),
    dist: path.resolve(distPath, path.dirname(filename))
  })
})

console.log('Start Watch Image')
