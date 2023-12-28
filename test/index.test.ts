import { describe, expect, it } from 'vitest'
import { deepOmit, deepPick } from '../src/index'

describe('deepPick', () => {
  it('picks flat objects', () => {
    // act
    const result = deepPick({
      a: 'this',
      b: ['this'],
      c: 'not this',
      d: ['not this'],
    }, ['a', 'b'])

    // assert
    expect(result).toStrictEqual({
      a: 'this',
      b: ['this'],
    })
  })

  it('picks nested objects', () => {
    // act
    const result = deepPick({
      a: {
        b: 'this',
        c: 'not this',
      },
      d: {
        e: ['this'],
        f: 'not this',
      },
    }, ['a.b', 'd.e'])

    // assert
    expect(result).toStrictEqual({
      a: { b: 'this' },
      d: { e: ['this'] },
    })
  })
})

describe('deepOmit', () => {
  it('omits flat objects', () => {
    // act
    const result = deepOmit({
      a: 'this',
      b: ['this'],
      c: 'not this',
      d: ['not this'],
    }, ['c', 'd'])

    // assert
    expect(result).toStrictEqual({
      a: 'this',
      b: ['this'],
    })
  })

  it('omits nested objects', () => {
    // act
    const result = deepOmit({
      a: {
        b: 'this',
        c: 'not this',
      },
      d: {
        e: ['this'],
        f: ['not this'],
      },
    }, ['a.c', 'd.f'])

    // assert
    expect(result).toStrictEqual({
      a: { b: 'this' },
      d: { e: ['this'] },
    })
  })
})
