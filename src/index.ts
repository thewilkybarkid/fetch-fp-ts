/**
 * @since 0.1.0
 */
import * as E from 'fp-ts/Either'
import * as R from 'fp-ts/Reader'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as r from 'fp-ts/Record'
import { Refinement } from 'fp-ts/Refinement'
import * as S from 'fp-ts/Semigroup'
import * as TE from 'fp-ts/TaskEither'
import { flow, pipe } from 'fp-ts/function'
import * as D from 'io-ts/Decoder'
import * as L from 'monocle-ts/Lens'

import DecodeError = D.DecodeError
import Decoder = D.Decoder
import ReaderTaskEither = RTE.ReaderTaskEither
import TaskEither = TE.TaskEither

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.1.0
 */
export type Fetch = (...args: Request) => Promise<Response>

/**
 * @category model
 * @since 0.1.0
 */
export type Request = [url: string, init: RequestInit]

type RequestInit = {
  readonly body?: string
  readonly headers: Record<string, string>
  readonly method: string
}

/**
 * @category model
 * @since 0.1.0
 */
export interface Response<S extends number = number> {
  readonly headers: Headers
  readonly status: S
  readonly statusText: string
  readonly url: string

  text(): Promise<string>
}

interface Headers extends Iterable<[string, string]> {
  get(name: string): string | null

  has(name: string): boolean
}

/**
 * @category model
 * @since 0.1.0
 */
export interface FetchEnv {
  fetch: Fetch
}

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.1.0
 */
export const Request: (method: string) => (url: string | { href: string }) => Request = method => url =>
  [typeof url === 'string' ? url : url.href, { headers: {}, method }]

/**
 * @category constructors
 * @since 0.1.0
 */
export const send: (request: Request) => ReaderTaskEither<FetchEnv, Error, Response> = ([url, init]) =>
  R.asks(TE.tryCatchK(({ fetch }) => fetch(url, init), E.toError))

// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------

/**
 * @category refinements
 * @since 0.1.1
 */
export const hasStatus: <S extends number>(...status: ReadonlyArray<S>) => Refinement<Response, Response<S>> =
  (...status) =>
  (response): response is Response<typeof status[number]> =>
    (status as ReadonlyArray<number>).includes(response.status)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * @category combinators
 * @since 0.1.1
 */
export const setHeaders: (headers: Record<string, string>) => (request: Request) => Request = b =>
  pipe(
    L.id<Request>(),
    L.component(1),
    L.prop('headers'),
    L.modify(a => r.getUnionSemigroup(S.last<string>()).concat(a, b)),
  )

/**
 * @category combinators
 * @since 0.1.1
 */
export const setHeader: (key: string, value: string) => (request: Request) => Request = flow(r.singleton, setHeaders)

/**
 * @category combinators
 * @since 0.1.2
 */
export const setBody: (body: string, contentType: string) => (request: Request) => Request = (body, contentType) =>
  flow(
    setHeader('Content-Type', contentType),
    pipe(
      L.id<Request>(),
      L.component(1),
      L.prop('body'),
      L.modify(() => body),
    ),
  )

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.1.1
 */
export const getText: <E>(onError: (reason: unknown) => E) => (response: Response) => TaskEither<E, string> = onError =>
  TE.tryCatchK(response => response.text(), onError)

/**
 * @since 0.1.3
 */
export const decode: <A>(decoder: Decoder<string, A>) => (response: Response) => TaskEither<DecodeError, A> = decoder =>
  flow(
    getText(() => D.error(undefined, 'string')),
    TE.chainEitherK(decoder.decode),
  )
