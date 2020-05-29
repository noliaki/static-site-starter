import fs from 'fs'
import util from 'util'
import path from 'path'

import config from '../config'

export const srcDir: string = path.resolve(__dirname, '..', config.src)
export const distDir: string = path.resolve(__dirname, '..', config.dist)
export const docRoot: string = path.resolve(__dirname, '..', config.docroot)

export const ejsExtenstion: string = 'ejs.html'
export const imageExtension: string[] = ['jpg', 'jpeg', 'gif', 'png', 'svg']
export const postCssExtension: string = 'postcss'
export const typescriptExtension: string = 'ts'

export const ejsReg: RegExp = new RegExp(
  `\\.${escapeRegExp(ejsExtenstion)}$`,
  'i'
)
export const imageReg: RegExp = new RegExp(
  `\\.(${imageExtension
    .map((ext: string): string => escapeRegExp(ext))
    .join('|')})$`,
  'i'
)
export const postcssReg: RegExp = new RegExp(
  `\\.${escapeRegExp(postCssExtension)}$`,
  'i'
)
export const tsReg: RegExp = new RegExp(
  `\\.${escapeRegExp(typescriptExtension)}$`,
  'i'
)

export const imageMinimatch: string = `*.{${imageExtension.join(
  ','
)},${imageExtension
  .map((extension: string): string => extension.toUpperCase())
  .join(',')}}`

export function shouldCopy(filename: string): boolean {
  return !(
    ejsReg.test(filename) ||
    postcssReg.test(filename) ||
    imageReg.test(filename) ||
    tsReg.test(filename)
  )
}

export const writeFilePromise: (
  path: string | number | Buffer | URL,
  data: any,
  options?: fs.WriteFileOptions
) => Promise<void> = util.promisify(fs.writeFile)

function escapeRegExp(pattern: string): string {
  return pattern.replace(/[.*+?^=!:${}()|[\]/\\]/g, '\\$&')
}
