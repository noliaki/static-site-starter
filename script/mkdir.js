const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shell = require('shelljs')

const docRoot = require('./config').docroot
const distPath = require('./config').dist

const dirs = glob.sync(`${docRoot}/**/`)

dirs.forEach(dir => {
  const dirname = path.resolve(distPath, path.relative(docRoot, dir))

  fs.access(dirname, error => {
    if (!error) {
      console.log(`Already Exist ${dirname}`)
      return
    }

    shell.mkdir('-p', dirname)
    console.log(`Created ${dirname}`)
  })
})
