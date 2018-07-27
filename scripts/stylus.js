const stylus = require('stylus')
// const autoprefixer = require('autoprefixer-stylus')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const url = require('url')

const paths = require('./paths')
const isStylus = require('./util').isStylus

const option = require('../config').stylus

const convertStylus = async filename => {
  const css = await compile(filename)

  writeFile(filename, css)
}

async function compile (filename) {
  const css = await stylusToCss(filename)
  const result = await addPrefix(css)

  result.warnings().forEach(warn => {
    console.warn(warn.toString())
  })

  return result.css
}

function stylusToCss (filename) {
  const str = fs.readFileSync(filename, {
    encoding: 'utf8'
  })

  return new Promise((resolve, reject) => {
    stylus(str)
      .include(path.resolve(option.include))
      .set('compress', option.compress || process.env.NODE_ENV === 'production')
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
  const distPath = path.resolve(paths.dist, path.relative(paths.docroot, filename))
  const cssFileName = distPath.replace(/\.styl$/, '.css')

  fs.ensureDirSync(path.dirname(distPath))

  fs.writeFile(cssFileName, string, error => {
    if (error) throw error

    console.log(`CREATED stylus -> css: ${cssFileName}`)
  })
}

function addPrefix (css) {
  return postcss([
    autoprefixer(option.autoprefixerOption)
  ]).process(css)
}

const exec = () => {
  const files = glob.sync(`${paths.docroot}/**/*.styl`).filter(file => isStylus.test(file))

  files.forEach(file => {
    convertStylus(file)
  })
}
exports.exec = exec

async function middleware (req, res, next) {
  const requestPath = url.parse(req.url).pathname
  const filePath = path.join(paths.docroot, requestPath.replace(/\.css$/i, '.styl'))

  if (!(/\.css$/i.test(requestPath)) || !fs.pathExistsSync(filePath)) {
    next()
    return
  }

  console.log(`stylus compile: ${requestPath}`)

  const css = await compile(filePath)

  res.writeHead(200, {'Content-Type': 'text/css'})
  res.end(css)
}
exports.middleware = middleware
