import eventEmitter from './EventEmitter'
import './Window'
import { WinState } from './Window'

// console.log(WinState.Winstate)

eventEmitter.on('winResize', (winState: WinState) => {
  console.log(winState)
})

eventEmitter.on('winScroll', (scrollTop: number) => {
  console.log(scrollTop)
})
