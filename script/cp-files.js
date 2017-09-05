const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shell = require('shelljs')
const docRoot = require('./config').docroot
const distPath = require('./config').dist

const files = glob.sync(`${docRoot}/**/*.!(pug|styl|jpg|jpeg|gif|png|svg|js)`, {
  nocase: true
})

files.forEach(file => {
  const distFile = path.resolve(distPath, path.relative(docRoot, file))
  fs.access(path.dirname(distFile), error => {
    if (!error) {
      copyFile(file, distFile)
      return
    }

    shell.mkdir('-p', path.dirname(distFile))
    copyFile(file, distFile)
  })
})

const copyFile = function copyFile (src, dist) {
  const readStream = fs.createReadStream(src)
  const writeStream = fs.createWriteStream(dist)

  writeStream
    .on('close', event => {
      console.log(`Done copy: ${dist}`)
    })
    .on('error', event => {
      console.log(event)
      throw new Error(event)
    })

  console.log(`Start copy: ${src}`)
  readStream.pipe(writeStream)
}

module.exports = copyFile
