import * as E from 'fp-ts/Either'
import * as _ from '../src'
import * as fc from './fc'

describe('fetch-fp-ts', () => {
  describe('constructors', () => {
    test('Request', () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), (method, url) => {
          expect(_.Request(method)(url)).toStrictEqual([url, { headers: {}, method }])
        }),
      )
    })

    describe('send', () => {
      test('when fetch returns a response', () => {
        fc.assert(
          fc.asyncProperty(fc.request(), fc.response(), async (request, response) => {
            const fetch: jest.MockedFunction<_.Fetch> = jest.fn((_url, _init) => Promise.resolve(response))

            const actual = await _.send(request)({ fetch })()

            expect(actual).toStrictEqual(E.right(response))
            expect(fetch).toHaveBeenCalledWith(...request)
          }),
        )
      })
      test('when fetch throws an error', () => {
        fc.assert(
          fc.asyncProperty(fc.request(), fc.error(), async (request, error) => {
            const fetch: _.Fetch = () => Promise.reject(error)

            const actual = await _.send(request)({ fetch })()

            expect(actual).toStrictEqual(E.left(error))
          }),
        )
      })
      test('when fetch throws a primitive', () => {
        fc.assert(
          fc.asyncProperty(fc.request(), fc.throwablePrimitive(), async (request, error) => {
            const fetch: _.Fetch = () => Promise.reject(error)

            const actual = await _.send(request)({ fetch })()

            expect(actual).toStrictEqual(E.left(new Error(String(error))))
          }),
        )
      })
    })
  })
})
