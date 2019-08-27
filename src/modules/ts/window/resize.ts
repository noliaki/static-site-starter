import debounce from 'lodash/debounce'
import EventEmitter, { EventType } from '../utils/event-emitter'

const resizeHandler: EventListener = debounce((event: Event): void => {
  EventEmitter.emit(EventType.ON_WINDOW_RESIZE)
}, 300)

window.addEventListener('resize', resizeHandler, false)
