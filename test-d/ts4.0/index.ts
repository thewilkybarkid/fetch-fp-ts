import { pipe } from 'fp-ts/function'
import nodeFetch from 'node-fetch'
import * as _ from '../../src'

declare const r1: _.Request
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

// $ExpectType ReaderTaskEither<FetchEnv, Error, Response>
_.send(r1)
