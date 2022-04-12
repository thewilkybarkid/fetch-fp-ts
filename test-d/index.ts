import { expectTypeOf } from 'expect-type'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'
import { identity, pipe } from 'fp-ts/function'
import * as D from 'io-ts/Decoder'
import nodeFetch from 'node-fetch'
import * as _ from '../src'

import DecodeError = D.DecodeError
import Decoder = D.Decoder
import Fetch = _.Fetch
import FetchEnv = _.FetchEnv
import Option = O.Option
import ReaderTaskEither = RTE.ReaderTaskEither
import Response = _.Response
import TaskEither = TE.TaskEither

declare const request: _.Request
declare const response: Response
declare const string: string
declare const url: URL
declare const numberToStringDecoder: Decoder<number, string>

//
// Fetch
//

expectTypeOf(fetch).toMatchTypeOf<Fetch>()
expectTypeOf(nodeFetch).toMatchTypeOf<Fetch>()

//
// Request
//

expectTypeOf(pipe(string, _.Request(string))).toMatchTypeOf(request)
expectTypeOf(pipe(url, _.Request(string))).toMatchTypeOf(request)

//
// send
//

expectTypeOf(_.send(request)).toMatchTypeOf<ReaderTaskEither<FetchEnv, Error, Response>>()

//
// hasStatus
//

expectTypeOf(pipe(response, O.fromPredicate(_.hasStatus(200)))).toMatchTypeOf<Option<Response<200>>>()
expectTypeOf(pipe(response, O.fromPredicate(_.hasStatus(200, 201)))).toMatchTypeOf<Option<Response<200 | 201>>>()

//
// setHeaders
//

expectTypeOf(pipe(request, _.setHeaders({ foo: 'bar' }))).toMatchTypeOf(request)

//
// setHeader
//

expectTypeOf(pipe(request, _.setHeader('foo', 'bar'))).toMatchTypeOf(request)

//
// setBody
//

expectTypeOf(pipe(request, _.setBody('foo', 'bar'))).toMatchTypeOf(request)

//
// getText
//

expectTypeOf(pipe(response, _.getText(identity))).toMatchTypeOf<TaskEither<unknown, string>>()
expectTypeOf(pipe(response, _.getText(E.toError))).toMatchTypeOf<TaskEither<Error, string>>()

//
// decode
//

expectTypeOf(pipe(response, _.decode(D.number))).toMatchTypeOf<TaskEither<DecodeError, number>>()
// @ts-expect-error
_.decode(numberToStringDecoder)
