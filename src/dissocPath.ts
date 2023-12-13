import { assocPath, dissocPath } from 'ramda'

export function deepOmitUnsafe(obj: object, paths: Array<string>) {
  return paths
    .reduce((acc, cur) => dissocPath(cur.split('.'), acc), obj)
}

console.log(deepOmitUnsafe({ a: { b: { c: 2 } } }, ['a.b.c', 'a.c']))
