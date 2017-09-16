const stylus = require('stylus')
const autoprefixer = require('autoprefixer-stylus')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shell = require('shelljs')
const url = require('url')

const src = require('./config').src
const dist = require('./config').dist
const docRoot = require('./config').docroot

const browsers = [
  'ie >= 6'
]

const convertStylus = async filename => {
  const css = await compile(filename)

  writeFile(filename, css)
}

const compile = filename => {
  const str = fs.readFileSync(filename, {
    encoding: 'utf8'
  })

  return new Promise((resolve, reject) => {
    stylus(str)
      .include(`${src}/modules/stylus`)
      .use(autoprefixer({
        browsers
      }))
      .set('compress', true)
      .render((error, output) => {
        if (error) {
          reject(error)
          throw error
        }

        resolve(output)
      })
  })
}

function writeFile (filename, string) {
  const distPath = path.resolve(dist, path.relative(docRoot, filename))

  shell.mkdir('-p', path.dirname(distPath))

  const cssFileName = distPath.replace(/\.styl$/, '.css')

  fs.writeFile(cssFileName, string, error => {
    if (error) throw error

    console.log(`CREATED stylus -> css: ${cssFileName}`)
  })
}

const exec = () => {
  const files = glob.sync(`${docRoot}/**/*.styl`)

  files.forEach(file => {
    convertStylus(file)
  })
}

if (process.env.NODE_ENV === 'production') {
  exec()
}

// middleware for browsersync
module.exports = async (req, res, next) => {
  const requestPath = url.parse(req.url).pathname

  if (!(/\.css$/.test(requestPath))) {
    next()
    return
  }

  console.log(`stylus compile: ${requestPath}`)

  const filePath = path.join(docRoot, requestPath.replace(/\.css$/, '.styl'))
  const css = await compile(filePath)

  res.end(css)
  next()
}
