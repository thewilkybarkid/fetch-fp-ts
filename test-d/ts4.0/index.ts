import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import nodeFetch from 'node-fetch'
import * as _ from '../../src'

declare const request: _.Request
declare const response: _.Response
declare const string: string
declare const url: URL

//
// Fetch
//

const f1: _.Fetch = fetch
const f2: _.Fetch = nodeFetch

//
// Request
//

// $ExpectType Request
pipe(string, _.Request(string))
// $ExpectType Request
pipe(url, _.Request(string))

//
// send
//

// $ExpectType ReaderTaskEither<FetchEnv, Error, Response<number>>
_.send(request)

//
// hasStatus
//

// $ExpectType Option<Response<200>>
pipe(response, O.fromPredicate(_.hasStatus(200)))

// $ExpectType Option<Response<200 | 201>>
pipe(response, O.fromPredicate(_.hasStatus(200, 201)))

//
// setHeaders
//

// $ExpectType Request
pipe(request, _.setHeaders({ foo: 'bar' }))

//
// setHeader
//

// $ExpectType Request
pipe(request, _.setHeader('foo', 'bar'))
