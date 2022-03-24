/**
 * @since 0.1.0
 */

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

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.1.0
 */
export const Request: (method: string) => (url: string) => Request = method => url => [url, { headers: {}, method }]
