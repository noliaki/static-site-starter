// @flow

interface Hoge {
  ho: string,
  fu: number
}

const awesome: Hoge = {
  ho: false,
  fu: 9
}

class Fuga {
  static fiz: number = 10
}

Fuga.fiz = 20

console.log(awesome.ho)
