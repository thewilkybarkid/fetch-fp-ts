---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [setHeader](#setheader)
  - [setHeaders](#setheaders)
- [constructors](#constructors)
  - [Request](#request)
  - [send](#send)
- [model](#model)
  - [Fetch (type alias)](#fetch-type-alias)
  - [FetchEnv (interface)](#fetchenv-interface)
  - [Request (type alias)](#request-type-alias)
  - [Response (interface)](#response-interface)
- [refinements](#refinements)
  - [hasStatus](#hasstatus)

---

# combinators

## setHeader

**Signature**

```ts
export declare const setHeader: (key: string, value: string) => (request: Request) => Request
```

Added in v0.1.1

## setHeaders

**Signature**

```ts
export declare const setHeaders: (headers: Record<string, string>) => (request: Request) => Request
```

Added in v0.1.1

# constructors

## Request

**Signature**

```ts
export declare const Request: (method: string) => (url: string | { href: string }) => Request
```

Added in v0.1.0

## send

**Signature**

```ts
export declare const send: (request: Request) => ReaderTaskEither<FetchEnv, Error, Response>
```

Added in v0.1.0

# model

## Fetch (type alias)

**Signature**

```ts
export type Fetch = (...args: Request) => Promise<Response>
```

Added in v0.1.0

## FetchEnv (interface)

**Signature**

```ts
export interface FetchEnv {
  fetch: Fetch
}
```

Added in v0.1.0

## Request (type alias)

**Signature**

```ts
export type Request = [url: string, init: RequestInit]
```

Added in v0.1.0

## Response (interface)

**Signature**

```ts
export interface Response<S extends number = number> {
  readonly headers: Headers
  readonly status: S
  readonly statusText: string
  readonly url: string

  text(): Promise<string>
}
```

Added in v0.1.0

# refinements

## hasStatus

**Signature**

```ts
export declare const hasStatus: <S extends number>(...status: readonly S[]) => Refinement<Response<number>, Response<S>>
```

Added in v0.1.1
