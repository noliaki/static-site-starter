// @flow

interface Hoge {
  ho: string,
  fu: number
}

const awesome: Hoge = {
  ho: 'false',
  fu: 9
}

const obj = {
  hoge: 2,
  fuga: 3
}

const obj2 = {
  ...obj,
  fiz: 3
}

class Fuga {
  static fiz: number = 3
}

Fuga.fiz = 20

console.log(awesome.ho)
