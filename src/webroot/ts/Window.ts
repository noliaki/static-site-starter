import eventEmitter from './EventEmitter'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

const doc: Document = window.document
const bodyEle: HTMLElement = (doc.documentElement || doc.body.parentNode as HTMLElement || doc.body)
const debounceInterval: number = 500
const throttleInterval: number = 100

export interface WinState {
  width: number
  height: number
  scrollTop: number
}

window.addEventListener('resize', debounce(winResize, debounceInterval), false)
window.addEventListener('scroll', throttle(winScroll, throttleInterval), false)

function winWidth (): number {
  return doc.documentElement.clientWidth
}

function winHeight (): number {
  return window.innerHeight || doc.documentElement.clientHeight || 0
}

function scrollTop (): number {
  return (window.pageYOffset !== undefined) ? window.pageYOffset : bodyEle.scrollTop
}

function winResize (event: Event): void {
  const param: WinState = {
    width: winWidth(),
    height: winHeight(),
    scrollTop: scrollTop()
  }

  eventEmitter.emit('winResize', param)
}

function winScroll (event: Event): void {
  eventEmitter.emit('winScroll', scrollTop())
}
