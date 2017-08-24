const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shell = require('shelljs')

const srcPath = require('./config').src
const distPath = require('./config').dist

const dirs = glob.sync(`${srcPath}/**/`)

dirs.forEach(dir => {
  const dirname = path.resolve(distPath, path.relative(srcPath, dir))

  fs.access(dirname, error => {
    if (!error) {
      console.log(`Already Exist ${dirname}`)
      return
    }

    shell.mkdir('-p', dirname)
    console.log(`Created ${dirname}`)
  })
})
