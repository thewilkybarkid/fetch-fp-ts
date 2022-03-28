---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [Request](#request)
  - [send](#send)
- [model](#model)
  - [Fetch (type alias)](#fetch-type-alias)
  - [FetchEnv (interface)](#fetchenv-interface)
  - [Request (type alias)](#request-type-alias)
  - [Response (interface)](#response-interface)

---

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
export interface Response {
  readonly headers: Headers
  readonly status: number
  readonly statusText: string
  readonly url: string

  text(): Promise<string>
}
```

Added in v0.1.0
