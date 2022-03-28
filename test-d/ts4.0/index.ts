import nodeFetch from 'node-fetch'
import * as _ from '../../src'

declare const r1: _.Request

//
// Fetch
//

const f1: _.Fetch = fetch
const f2: _.Fetch = nodeFetch

//
// send
//

// $ExpectType ReaderTaskEither<FetchEnv, Error, Response>
_.send(r1)
