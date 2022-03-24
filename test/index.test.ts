import * as fc from 'fast-check'
import * as _ from '../src'

describe('fetch-fp-ts', () => {
  describe('constructors', () => {
    test('Request', () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), (method, url) => {
          expect(_.Request(method)(url)).toStrictEqual([url, { headers: {}, method }])
        }),
      )
    })
  })
})
