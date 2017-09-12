const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shell = require('shelljs')
const docRoot = require('./config').docroot
const distPath = require('./config').dist

const files = glob.sync(`${docRoot}/**/*.!(pug|styl|jpg|jpeg|gif|png|svg|js)`, {
  nocase: true
})

const copyFile = filename => {
  const distFile = path.resolve(distPath, path.relative(docRoot, filename))
  const readStream = fs.createReadStream(filename)
  const writeStream = fs.createWriteStream(distFile)

  shell.mkdir('-p', path.dirname(distFile))

  writeStream
    .on('close', event => {
      console.log(`Done copy: ${distFile}`)
    })
    .on('error', event => {
      console.log(event)
      throw new Error(event)
    })

  console.log(`Start copy: ${filename}`)
  readStream.pipe(writeStream)
}

files.forEach(file => {
  copyFile(file)
})

module.exports = copyFile
