export default class EventEmitter {
  private static handler: Map<string, Function> = new Map()

  public static on(eventName: string, cb: Function): void {
    if (this.handler[eventName] === 'undefined') {
      this.handler[eventName] = []
    }

    this.handler[eventName].push(cb)
  }

  public static emit(eventName: string, ...args: any): void {
    if (this.handler[eventName] === 'undefined') {
      return
    }

    const len: number = this.handler[eventName].length

    for (let i: number = 0; i < len; i++) {
      this.handler[eventName][i](...args)
    }
  }
}

export const EventType = {
  ON_MATCH_MEDIA: 'ON_MATCH_MEDIA',
  ON_WINDOW_LOAD: 'ON_WINDOW_LOAD',
  ON_WINDOW_RESIZE: 'ON_WINDOW_RESIZE'
}
