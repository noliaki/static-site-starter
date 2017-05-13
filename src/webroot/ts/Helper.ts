import { Promise } from 'es6-promise'

export function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject): void => {
    const image: HTMLImageElement = new Image()
    image.addEventListener('load', (event: Event): void => {
      resolve(image)
    })
    image.addEventListener('error', (event: Event): void => {
      console.log(event)
      reject(event)
    })
    image.src = path
  })
}
