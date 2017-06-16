interface Listener {
  [T: string]: Function[]
}

class EventDispatcher {
  private listener: Listener

  public on (eventName: string, func: Function): void {
    if (!this.listener[eventName]) {
      this.listener[eventName] = []
    }
    this.listener[eventName].push(func)
  }

  public emit (eventName: string, params?: any): void {
    if (!this.listener[eventName]) {
      return
    }

    const listeners: Function[] = this.listener[eventName]
    const len: number = listeners.length
    let i: number = 0

    for (; i < len; i ++) {
      listeners[i](params)
    }
  }
}

export default new EventDispatcher()
