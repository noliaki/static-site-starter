import rimraf from 'rimraf'
import path from 'path'
import chalk from 'chalk'
import config from '../config'

const distDir: string = path.resolve(__dirname, '..', config.dist)

rimraf(distDir, (err: Error): void => {
  if (err) throw new Error(err.message)

  console.log(`${chalk.red('[Removed]')} ${chalk.cyan(distDir)}`)
})
