import eventEmitter from './EventEmitter'
import './Window'
import { loadImage } from './Helper'

hoge('http://static.pinky-media.jp/matome/file/parts/I0010974/fb099dffdf8f222acaadd1a3cb064eeb359a0.jpg')

async function hoge (path: string) {
  const image: HTMLImageElement = await loadImage(path)
  if (!image) {
    console.log('ERROR')
  }
}

// import { WinState } from './Window'

// eventEmitter.on('winResize', (winState: Win.WinState) => {
//   console.log(winState)
// })

// eventEmitter.on('winScroll', (scrollTop: number) => {
//   console.log(scrollTop)
// })
