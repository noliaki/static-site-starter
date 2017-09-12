const stylus = require('stylus')
const autoprefixer = require('autoprefixer-stylus')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shell = require('shelljs')

const src = require('./config').src
const dist = require('./config').dist
const docRoot = require('./config').docroot

const files = glob.sync(`${docRoot}/**/*.styl`)

const convertStylus = function (filename) {
  const str = fs.readFileSync(filename, {
    encoding: 'utf8'
  })

  stylus(str)
    .include(`${src}/modules/stylus`)
    .use(autoprefixer({
      browsers: ['ie >= 6']
    }))
    .set('compress', true)
    .render((err, output) => {
      if (err) throw err

      writeFile(filename, output)
    })
}

files.forEach(file => {
  convertStylus(file)
})

function writeFile (filename, string) {
  const distPath = path.resolve(dist, path.relative(docRoot, filename))

  shell.mkdir('-p', path.dirname(distPath))

  fs.writeFile(distPath.replace(/(\.styl)$/, '.css'), string, error => {
    if (error) throw error

    console.log(`WRITTEN: ${distPath}`)
  })
}

module.exports = convertStylus
