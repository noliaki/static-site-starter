import path from 'path'
import config from '../config'

export const srcDir: string = path.resolve(__dirname, '..', config.src)
export const distDir: string = path.resolve(__dirname, '..', config.dist)
export const docRoot: string = path.resolve(__dirname, '..', config.docroot)

export const isNunjucks = /\.njk$/i
export const isImage = /\.(jpe?g|gif|png|svg)$/i
export const isStylus = /\.styl$/i
export const isTs = /\.ts$/i

export function shouldCopy(filename: string): boolean {
  return !(
    isNunjucks.test(filename) ||
    isStylus.test(filename) ||
    isImage.test(filename) ||
    isTs.test(filename)
  )
}
