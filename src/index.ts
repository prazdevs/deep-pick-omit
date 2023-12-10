import { assocPath, dissocPath, path } from 'rambda'

type Path<O, K extends keyof O = keyof O> = K extends string | number
  ? O[K] extends infer V
    ? `${K}`| (V extends Record<string, unknown> ? `${K}.${Path<V>}` : never)
    : never
  : never

export function deepPickUnsafe(obj: object, paths: Array<string>) {
  return paths
    .map<[string, unknown]>(p => [p, path(p, obj)])
    .filter(t => !!t[1])
    .reduce((acc, cur) => assocPath(cur[0], cur[1], acc), {})
}

export function deepPick<O extends object>(obj: O, paths: Array<Path<O>>) {
  return deepPickUnsafe(obj, paths)
}

export function deepOmitUnsafe(obj: object, paths: Array<string>) {
  return paths
    .reduce((acc, cur) => dissocPath(cur, acc), obj)
}

export function deepOmit<O extends object>(obj: O, paths: Array<Path<O>>) {
  return deepOmitUnsafe(obj, paths)
}
