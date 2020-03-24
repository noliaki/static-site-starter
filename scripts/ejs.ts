import ejs from 'ejs'
import http from 'http'
import path from 'path'
import fs from 'fs'
import fg from 'fast-glob'
import { html as htmlBeautify } from 'js-beautify'
import config from '../config'
import {
  docRoot,
  srcDir,
  distDir,
  ejsExtenstion,
  ejsReg,
  writeFilePromise
} from './util'
import chalk from 'chalk'
import { WebSiteConfig } from '../types/config'

interface PageData {
  URL: string
  CANONICAL_URL: string
  PATH: string
  BASE_URL: string
}

const BASE_URL: string = `${config.webSiteConfig.PROTOCOL}://${config.webSiteConfig.DOMAIN_NAME}`
const ejsDefaultOptions: ejs.Options = {
  root: srcDir
}

function createData(pathName: string = '/'): WebSiteConfig & PageData {
  const url: URL = new URL(pathName, BASE_URL)

  return Object.assign({}, config.webSiteConfig, {
    URL: url.href,
    CANONICAL_URL: url.href.replace(/\/index.html$/, '/'),
    PATH: url.pathname,
    BASE_URL
  })
}

function renderFile(
  fileName: string,
  data: any,
  options: ejs.Options
): Promise<string> {
  console.log(`${chalk.green('[ejs]')} ${fileName}`)
  return new Promise(
    (
      resolve: (htmlSource: string) => void,
      reject: (reason: any) => void
    ): void => {
      ejs.renderFile(
        fileName,
        data,
        options,
        (err, htmlSource: string): void => {
          if (err) {
            reject(err)
            return
          }

          resolve(htmlSource)
        }
      )
    }
  )
}

function writeFile(fileName: string, htmlString: string): Promise<void> {
  const distPath = path.resolve(distDir, path.relative(docRoot, fileName))
  const htmlFileName = distPath.replace(ejsReg, '.html')

  fs.mkdirSync(path.dirname(distPath), {
    recursive: true
  })

  return writeFilePromise(htmlFileName, htmlString)
}

export async function middleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
): Promise<void> {
  const url: URL = new URL(req.url, BASE_URL)
  const requestPath: string = url.pathname
  const filePath: string = path.join(
    docRoot,
    requestPath.replace(/\.html$/i, `.${ejsExtenstion}`)
  )

  if (!/\.html$/i.test(requestPath) || !fs.existsSync(filePath)) {
    next()
    return
  }

  const htmlSource: string = await renderFile(
    filePath,
    createData(requestPath),
    ejsDefaultOptions
  )

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(htmlBeautify(htmlSource, config.htmlBeautifyOptions))
}

export function renderAll(): void {
  const nunjucksFiles: string[] = fg.sync([
    `${docRoot}/*.${ejsExtenstion}`,
    `${docRoot}/**/*.${ejsExtenstion}`
  ])

  Promise.all(
    nunjucksFiles.map(
      async (fileName: string): Promise<void> => {
        const htmlFileName: string = fileName.replace(ejsReg, '.html')
        const htmlSource: string = await renderFile(
          fileName,
          createData(path.relative(docRoot, htmlFileName)),
          ejsDefaultOptions
        )

        return writeFile(
          fileName,
          htmlBeautify(htmlSource, config.htmlBeautifyOptions)
        )
      }
    )
  )
}
