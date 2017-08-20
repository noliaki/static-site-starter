const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shell = require('shelljs')
const srcPath = require('./config').src
const distPath = require('./config').dist

const files = glob.sync(`${srcPath}/**/*.!(pug|styl|jpg|jpeg|gif|png|svg|js)`, {
  nocase: true
})

files.forEach(file => {
  const distFile = path.resolve(distPath, path.relative(srcPath, file))
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

  writeStream.on('close', (event) => {
    console.log(`Done copy: ${dist}`)
  })

  console.log(`Start copy: ${src}`)
  readStream.pipe(writeStream)
}

module.exports = copyFile
