import { expectTypeOf, test } from 'vitest'
import {
  deepOmit,
  deepOmitUnsafe,
  deepPick,
  deepPickUnsafe,
  type Path,
} from '../src/index'

const o = {
  a: {
    b: 'this',
    c: 'not this',
  },
  d: 'this',
}
const fails = ['f']
const passes = ['a', 'a.b', 'd'] satisfies Path<typeof o>[]

test('deepPick', () => {
  // @ts-expect-error `e` is not a key of `obj`
  expectTypeOf(deepPick<typeof o>).toBeCallableWith(o, fails)
  expectTypeOf(deepPick<typeof o>).toBeCallableWith(o, passes)
})

test('deepOmit', () => {
  // @ts-expect-error `e` is not a key of `obj`
  expectTypeOf(deepOmit<typeof o>).toBeCallableWith(o, fails)
  expectTypeOf(deepOmit<typeof o>).toBeCallableWith(o, passes)
})

test('deepPickUnsafe', () => {
  expectTypeOf(deepPickUnsafe).toBeCallableWith(o, fails)
  expectTypeOf(deepPickUnsafe).toBeCallableWith(o, passes)
})

test('deepOmitUnsafe', () => {
  expectTypeOf(deepOmitUnsafe).toBeCallableWith(o, fails)
  expectTypeOf(deepOmitUnsafe).toBeCallableWith(o, passes)
})
