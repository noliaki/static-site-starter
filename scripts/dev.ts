import fs from 'fs'
import path from 'path'
import bs from 'browser-sync'
import { middleware as postcssMiddleware } from './postcss'
import { middleware as ejsMiddleware } from './ejs'
import { compress, compressAll } from './imagemin'
import { copyFile, copyAll } from './copy'
import {
  srcDir,
  postcssReg,
  imageReg,
  tsReg,
  docRoot,
  ejsReg,
  distDir
} from './util'
import config from '../config'

const options: bs.Options = {
  server: {
    baseDir: distDir,
    directory: true
  },
  files: distDir
}

compressAll()
copyAll()

bs.init({
  ...Object.assign({}, options, config.browsersync),
  middleware: [ejsMiddleware, postcssMiddleware]
})

fs.watch(
  srcDir,
  { recursive: true },
  (event: string, filename: string): void => {
    console.log(event, filename)

    // ignore
    if (ignoreFile(filename)) {
      console.log('ignore this file')
      return
    }

    const absolutePath = path.resolve(srcDir, filename)

    if (!fs.existsSync(absolutePath)) {
      console.log('not exist')
      return
    }

    // ejs
    if (ejsReg.test(filename) || /\.html$/i.test(filename)) {
      console.log(path.relative(docRoot, filename))
      bs.reload('*.html')
      return
    }

    // stylus
    if (postcssReg.test(filename)) {
      console.log(path.relative(docRoot, filename))
      bs.reload('*.css')
      return
    }

    // image file
    if (imageReg.test(filename)) {
      compress(absolutePath)
      return
    }

    const stats: fs.Stats = fs.statSync(absolutePath)

    if (absolutePath.includes(docRoot) && stats.isFile()) {
      copyFile(absolutePath)
    }
  }
)

function ignoreFile(filename: string): boolean {
  return tsReg.test(filename) || /\/\./.test(filename)
}
