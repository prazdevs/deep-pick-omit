import { get, set, unset } from './utils'

export type Path<O, K extends keyof O = keyof O> = K extends string | number
  ? O[K] extends infer V
    ? `${K}`| (V extends Record<string, unknown> ? `${K}.${Path<V>}` : never)
    : never
  : never

export function deepPickUnsafe(obj: object, paths: Array<string>) {
  return paths
    .map(p => p.split('.'))
    .map<[string[], unknown]>(p => [p, get(obj, p)])
    .filter(t => !!t[1])
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
