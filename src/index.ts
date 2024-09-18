import { get, set, unset } from './utils'

type IsAny<T> = unknown extends T ? ([keyof T] extends [never] ? false : true) : false

type ExcludeArrayKeys<T> = T extends ArrayLike<any> ? Exclude<keyof T, keyof any[]> : keyof T

type PathImpl<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
    ? never
    : T[Key] extends Record<string, any>
      ?
      | `${Key}.${PathImpl<T[Key], ExcludeArrayKeys<T[Key]>> & string}`
      | `${Key}.${ExcludeArrayKeys<T[Key]> & string}`
      : never
  : never

export type Path<T> = keyof T extends string
  ? (PathImpl<T, keyof T> | keyof T) extends infer P
      ? P extends string | keyof T
        ? P
        : keyof T
      : keyof T
  : never

export function deepPickUnsafe(obj: object, paths: Array<string>) {
  return paths
    .map(p => p.split('.'))
    .map<[string[], unknown]>(p => [p, get(obj, p)])
    .filter(t => t[1] !== undefined)
    .reduce((acc, cur) => set(acc, cur[1], cur[0]), {})
}

export function deepPick<O extends object>(obj: O, paths: Array<Path<O>>) {
  return deepPickUnsafe(obj, paths)
}

export function deepOmitUnsafe(obj: object, paths: Array<string>) {
  return paths
    .map(p => p.split('.'))
    .reduce((acc, cur) => unset(acc, cur), obj)
}

export function deepOmit<O extends object>(obj: O, paths: Array<Path<O>>) {
  return deepOmitUnsafe(obj, paths)
}
