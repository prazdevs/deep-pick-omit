import { dissocPath } from 'rambda'

type Indexable<T = any> = Record<string | number, T>
type Path<O, K extends keyof O = keyof O> = K extends string | number
  ? O[K] extends infer V
    ? `${K}`| (V extends Record<string, unknown> ? `${K}.${Path<V>}` : never)
    : never
  : never

function get(obj: object, path: string[]) {
  if (obj == null)
    return undefined

  let value = obj

  for (let i = 0; i < path.length; i++) {
    if (value == null || (value as Indexable)[path[i]] == null)
      return undefined

    value = (value as Indexable)[path[i]]
  }

  return value
}

function set(path: string[], value: any, obj: object) {
  if (path.length === 0)
    return value

  const idx = path[0]
  if (path.length > 1) {
    value = set(
      Array.prototype.slice.call(path, 1),
      value,
      typeof obj !== 'object'
        || obj === null
        || !Object.prototype.hasOwnProperty.call(obj, idx)
        ? Number.isInteger(Number(path[1]))
          ? []
          : {}
        : (obj as Indexable)[idx],
    )
  }

  if (Number.isInteger(Number(idx)) && Array.isArray(obj))
    return (obj.slice() as Indexable)[idx]

  return Object.assign({}, obj, { [idx]: value })
}

export function deepPickUnsafe(obj: object, paths: Array<string>) {
  return paths
    .map(p => p.split('.'))
    .map<[string[], unknown]>(p => [p, get(obj, p)])
    .filter(t => !!t[1])
    .reduce((acc, cur) => set(cur[0], cur[1], acc), {})
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
