const hoge: number = 9

console.log(hoge)

const promise: Promise<string> = new Promise((resolve, reject): void => {
  setTimeout((): void => {
    resolve('hoge')
  }, 2000)
})

promise.then((value: string) => {
  console.log(value)
})
