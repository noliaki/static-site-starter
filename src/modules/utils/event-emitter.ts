export default class EventEmitter {
  private static handler: Map<string, Set<() => void>> = new Map()

  public static on(eventName: string, fb: () => void): void {
    if (!this.handler.has(eventName)) {
      this.handler.set(eventName, new Set())
    }

    this.handler.get(eventName).add(fb)
  }

  public static emit(eventName: string, ...args: any[]): void {
    if (!this.handler.has(eventName)) {
      return
    }

    this.handler
      .get(eventName)
      .forEach((fb: (...args: any[]) => void): void => {
        fb(...args)
      })
  }
}

export const EventType = {
  ON_MATCH_MEDIA: 'ON_MATCH_MEDIA',
  ON_WINDOW_LOAD: 'ON_WINDOW_LOAD',
  ON_WINDOW_RESIZE: 'ON_WINDOW_RESIZE',
}
