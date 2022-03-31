import * as fc from 'fast-check'
import { Headers } from 'node-fetch'
import * as _ from '../src'

export * from 'fast-check'

export const request = ({ headers }: { headers?: Record<string, string> } = {}): fc.Arbitrary<_.Request> =>
  fc.tuple(
    fc.string(),
    fc.record({
      body: fc.option(fc.string(), { nil: undefined }),
      headers: headers ? fc.constant(headers) : fc.dictionary(fc.string(), fc.string()),
      method: fc.string(),
    }),
  )

const headerName = () =>
  fc.stringOf(
    fc.char().filter(char => /^[\^_`a-zA-Z\-0-9!#$%&'*+.|~]$/.test(char)),
    { minLength: 1 },
  )
const headers = () =>
  fc.option(fc.dictionary(headerName(), fc.string()), { nil: undefined }).map(init => new Headers(init))

export const response = ({ text }: { text?: Promise<string> } = {}): fc.Arbitrary<_.Response> =>
  fc.record({
    headers: headers(),
    status: fc.integer(),
    statusText: fc.string(),
    url: fc.string(),
    text: fc.func(text ? fc.constant(text) : fc.string().map(text => Promise.resolve(text))),
  })

export const error = (): fc.Arbitrary<Error> => fc.string().map(error => new Error(error))

export const throwablePrimitive = (): fc.Arbitrary<string | number | boolean> =>
  fc.oneof(fc.string(), fc.integer(), fc.boolean())
