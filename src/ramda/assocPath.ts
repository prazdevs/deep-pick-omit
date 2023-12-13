const _isArray = (v: any) => Array.isArray(v)
const _isInteger = (v: any) => Number.isInteger(v)
const isNil = (v: any) => v == null
const _has = (p: string | number, o: object) => Object.prototype.hasOwnProperty.call(o, p)

type Indexable<T = unknown> = Record<number | string, T>

function _assoc(prop: string | number, val: unknown, obj: object | Array<any>) {
  if (Number.isInteger(prop) && Array.isArray(obj)) {
    const arr = ([] as Array<unknown>).concat(obj)
    arr[prop as number] = val
    return arr
  }

  const result = {} as Indexable
  for (const p in obj)
    result[p] = (obj as Indexable)[p]

  result[prop] = val
  return result
}

export function assocPath(path: Array<string | number>, val: unknown, obj: object) {
  if (path.length === 0)
    return val

  const idx = path[0]
  if (path.length > 1) {
    const nextObj = (!isNil(obj) && _has(idx, obj) && typeof (obj as Indexable)[idx] === 'object')
      ? (obj as Indexable)[idx]
      : _isInteger(path[1])
        ? []
        : {}
    val = assocPath(Array.prototype.slice.call(path, 1), val, nextObj as object)
  }
  return _assoc(idx, val, obj)
}
