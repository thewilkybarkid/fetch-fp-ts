---
title: Home
nav_order: 1
---

A fetch wrapper for use with [fp-ts].

# Example

```ts
import fetch from 'cross-fetch'
import * as F from 'fetch-fp-ts'
import * as C from 'fp-ts/Console'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { pipe } from 'fp-ts/function'

const env: F.FetchEnv = {
  fetch,
}

pipe(
  F.Request('HEAD')('foo'),
  F.send,
  RTE.chainFirstIOK(response => C.log(`Status code for ${response.url} is ${response.status}`)),
)(env)()
/*
Status code for https://www.example.com/ is 200
*/
```

[fp-ts]: https://gcanti.github.io/fp-ts/
