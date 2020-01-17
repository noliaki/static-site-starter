import fs from 'fs'
import fg from 'fast-glob'
import path from 'path'
import chalk from 'chalk'
import { shouldCopy, distDir, docRoot } from './util'

export function copyFile(fileName: string): void {
  if (!shouldCopy(fileName)) return

  const distFile: string = path.resolve(
    distDir,
    path.relative(docRoot, fileName)
  )

  fs.mkdirSync(path.dirname(distFile), {
    recursive: true
  })

  const src: fs.ReadStream = fs.createReadStream(fileName)
  const dest: fs.WriteStream = fs.createWriteStream(distFile)

  src.on('end', (): void => {
    dest.end()
    console.log(`${chalk.green('[copy]')} ${distFile}`)
  })
  src.pipe(dest)
}

export function copyAll(): void {
  const files: string[] = fg
    .sync([`${docRoot}/**/*`, `${docRoot}/*`])
    .filter((file: string): boolean => shouldCopy(file))

  files.forEach((file: string): void => copyFile(file))
}
