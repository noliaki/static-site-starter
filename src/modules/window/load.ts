import debounce from 'lodash/debounce'
import EventEmitter, { EventType } from '../utils/event-emitter'

window.addEventListener(
  'load',
  (event: Event): void => {
    EventEmitter.emit(EventType.ON_WINDOW_LOAD)
  },
  false
)
