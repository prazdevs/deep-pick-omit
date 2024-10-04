type Indexable<T = any> = Record<string | number, T>

export function get(obj: object, path: Array<string | number>) {
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

export function set(obj: object, value: any, path: Array<string | number>) {
  if (path.length === 0)
    return value

  const idx = path[0]
  if (path.length > 1) {
    value = set(
      typeof obj !== 'object'
      || obj === null
      || !Object.prototype.hasOwnProperty.call(obj, idx)
        ? Number.isInteger(Number(path[1]))
          ? []
          : {}
        : (obj as Indexable)[idx],
      value,
      Array.prototype.slice.call(path, 1),
    )
  }

  if (Number.isInteger(Number(idx)) && Array.isArray(obj))
    return (obj.slice() as Indexable)[idx]

  return Object.assign({}, obj, { [idx]: value })
}

export function unset(obj: object, path: Array<string | number>): object {
  if (obj == null || path.length === 0)
    return obj

  if (path.length === 1) {
    if (obj == null)
      return obj

    if (Number.isInteger(path[0]) && Array.isArray(obj))
      return Array.prototype.slice.call(obj, 0).splice(path[0] as number, 1)

    const result: Indexable = {}
    for (const p in obj)
      result[p] = (obj as Indexable)[p]

    delete result[path[0]]
    return result
  }

  if ((obj as Indexable)[path[0]] == null) {
    if (Number.isInteger(path[0]) && Array.isArray(obj))
      return Array.prototype.concat.call([], obj)

    const result: Indexable = {}
    for (const p in obj)
      result[p] = (obj as Indexable)[p]

    return result
  }

  return set(
    obj,
    unset(
      (obj as Indexable)[path[0]],
      Array.prototype.slice.call(path, 1),
    ),
    [path[0]],
  )
}
