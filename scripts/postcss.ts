import fs from 'fs'
import path from 'path'
import http from 'http'
import fg from 'fast-glob'
import postcss from 'postcss'
import postcssPresetEnv from 'postcss-preset-env'
import chalk, { ChalkFunction } from 'chalk'
import { postCssExtension, docRoot, distDir, writeFilePromise } from './util'
import config from '../config'

const chalkColor: ChalkFunction = chalk.magentaBright
const chalkErrorColor: ChalkFunction = chalk.red

async function render(fileName: string): Promise<string | { error: string }> {
  const cssString: string = fs.readFileSync(fileName, {
    encoding: 'utf8'
  })

  const resultCss: string | { error: string } = await postcss([
    postcssPresetEnv(config.postcss.preset)
  ])
    .process(cssString, {
      from: undefined
    })
    .then((result: postcss.Result): string => {
      result.warnings().forEach((warning: postcss.Warning): void => {
        console.warn(`[warning:postcss] ${warning}`)
      })

      return result.css
    })
    .catch((error: postcss.CssSyntaxError): { error: string } => {
      const errorSubject: string = `${error.name}: ${error.reason}`
      const errorBody: string = `[${error.line},${error.column}] ${fileName}`
      console.error(chalkErrorColor(errorSubject))
      console.error(chalkColor(errorBody))

      return { error: `${errorSubject}\n${errorBody}` }
    })

  return resultCss
}

function writeFile(filename: string, cssString: string): Promise<void> {
  const distPath = path.resolve(distDir, path.relative(docRoot, filename))
  const cssFileName = distPath.replace(postCssExtension, '.css')

  fs.mkdirSync(path.dirname(distPath), {
    recursive: true
  })

  return writeFilePromise(cssFileName, cssString)
}

export function renderAll(): void {
  const postcssFiles: string[] = fg.sync([
    `${docRoot}/**/*.${postCssExtension}`,
    `${docRoot}/*.${postCssExtension}`
  ])

  Promise.all(
    postcssFiles.map(
      async (cssFile: string): Promise<void> => {
        const resultCss: string | { error: string } = await render(cssFile)
        if (typeof resultCss === 'string') {
          await writeFile(cssFile, resultCss)
        }
      }
    )
  )
}

export async function middleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void
): Promise<void> {
  const url: URL = new URL(req.url, `http://${req.headers.host}`)
  const requestPath: string = url.pathname
  const filePath: string = path.join(
    docRoot,
    requestPath.replace(/\.css$/i, `.${postCssExtension}`)
  )

  if (!/\.css$/i.test(requestPath) || !fs.existsSync(filePath)) {
    next()
    return
  }

  const css: string | { error: string } = await render(filePath)

  if (typeof css !== 'string') {
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message: css.error
      })
    )
    return
  }

  res.writeHead(200, { 'Content-Type': 'text/css' }).end(css)
}
