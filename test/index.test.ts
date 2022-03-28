import * as E from 'fp-ts/Either'
import * as _ from '../src'
import * as fc from './fc'

describe('fetch-fp-ts', () => {
  describe('constructors', () => {
    describe('Request', () => {
      test('with a string URL', () => {
        fc.assert(
          fc.property(fc.string(), fc.string(), (method, url) => {
            expect(_.Request(method)(url)).toStrictEqual([url, { headers: {}, method }])
          }),
        )
      })

      test('with a URL object', () => {
        fc.assert(
          fc.property(fc.string(), fc.string(), (method, url) => {
            expect(_.Request(method)({ href: url })).toStrictEqual([url, { headers: {}, method }])
          }),
        )
      })
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

  describe('combinators', () => {
    describe('setHeaders', () => {
      test('when the headers do not exist', () => {
        fc.assert(
          fc.property(fc.request({ headers: {} }), fc.dictionary(fc.string(), fc.string()), (request, headers) => {
            expect(_.setHeaders(headers)(request)).toStrictEqual([
              request[0],
              {
                ...request[1],
                headers,
              },
            ])
          }),
        )
      })

      test('when headers already exist', () => {
        fc.assert(
          fc.property(fc.request({ headers: { foo: 'bar' } }), request => {
            expect(_.setHeaders({ foo: 'baz' })(request)).toStrictEqual([
              request[0],
              {
                ...request[1],
                headers: { foo: 'baz' },
              },
            ])
          }),
        )
      })
    })

    describe('setHeader', () => {
      test('when the header does not exist', () => {
        fc.assert(
          fc.property(fc.request({ headers: {} }), fc.string(), fc.string(), (request, key, value) => {
            expect(_.setHeader(key, value)(request)).toStrictEqual([
              request[0],
              {
                ...request[1],
                headers: { [key]: value },
              },
            ])
          }),
        )
      })

      test('when the header already exists', () => {
        fc.assert(
          fc.property(fc.request({ headers: { foo: 'bar' } }), request => {
            expect(_.setHeader('foo', 'baz')(request)).toStrictEqual([
              request[0],
              {
                ...request[1],
                headers: { foo: 'baz' },
              },
            ])
          }),
        )
      })
    })
  })
})
