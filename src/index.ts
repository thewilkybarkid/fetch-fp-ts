/**
 * @since 0.1.0
 */
import * as E from 'fp-ts/Either'
import * as R from 'fp-ts/Reader'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'

import ReaderTaskEither = RTE.ReaderTaskEither

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
export interface Response {
  readonly headers: Headers
  readonly status: number
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
