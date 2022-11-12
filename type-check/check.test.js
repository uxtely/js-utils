/**
 * Copyright (c) Uxtely LLC. All rights reserved. Licensed under the ISC
 * license found in the LICENSE file in the root directory of this source tree.
 */

import test from 'node:test'
import { throws, doesNotThrow } from 'node:assert/strict'
import { check, Shape, Where, Optional, OptionalWhere } from './check.js'


function oks(arg, defs) {
	test('OKs', () => doesNotThrow(() => check(arg, defs)))
}

function fails(arg, defs, msg = '') {
	test('Fails', () => throws(() => check(arg, defs), new RegExp(`^TypeError: ${msg}$`)))
}

console.log('check')

// check (single)
oks(1, Number)
oks('a', String)
oks({}, Object)

oks(new Number(1), Number)
oks(new String(''), String)
oks(Object.create(null), Object)
oks(Object.create({}), Object)
oks(new Date(), Date)

oks(new Int8Array(), Int8Array)
oks(new Int16Array(), Int16Array)
oks(new Int32Array(), Int32Array)
oks(new BigInt64Array(), BigInt64Array)

oks(new Uint8Array(), Uint8Array)
oks(new Uint16Array(), Uint16Array)
oks(new Uint32Array(), Uint32Array)
oks(new BigUint64Array(), BigUint64Array)
oks(new Uint8ClampedArray(), Uint8ClampedArray)

oks(new Float32Array(), Float32Array)
oks(new Float64Array(), Float64Array)

fails({}, Array, `Got: "\\[object Object\\]"`)
fails(new Date(), Function, `Got: "\\[object Date\\]"`)
fails(null, Object, `Got: "\\[object Null\\]"`)
fails(new Int8Array(), Int16Array, `Got: "\\[object Int8Array\\]"`)


// check (multi)
fails(null,
	{},
	'Expected an object literal as argument')

fails({},
	null,
	'Expected an object literal as type definitions')

fails({ a: '' },
	{},
	'Missing type definition for "a"')

fails({},
	{ a: String },
	'Missing argument "a"')

fails({ a: '' },
	{ a: Number },
	'Mismatch on "a"')

oks({
		a: '',
		b: 1,
		c: true,
		d: {},
		e: Object.create(null),
		f: (function () { return {} }()),
		g: [],

		h: 2n,
		i: /regex/g,
		j: function () {},

		k: new function () { this.x = 1 },
		l: new Date(),
		m: new Int16Array(1)
	},
	{
		a: String,
		b: Number,
		c: Boolean,
		d: Object,
		e: Object,
		f: Object,
		g: Array,
		h: BigInt,
		i: RegExp,
		j: Function,

		k: Shape({ x: Number }),
		l: Date,
		m: Int16Array
	})

// Optional
oks({},
	{ a: Optional(String) })

oks({ a: '' },
	{ a: Optional(String) })

fails({ a: '' },
	{ a: Optional(Number) },
	'Mismatch on "a"')


// Where
const isEmptyString = value => value === ''

oks({ a: '', b: 1 },
	{
		a: Where(isEmptyString),
		b: Where(Number.isInteger),
		c: Optional(String),
		d: OptionalWhere(Array.isArray)
	})

fails({},
	{ a: Where(isEmptyString) },
	'Missing argument "a"')

fails({ a: 'non empty string' },
	{ a: Where(isEmptyString) },
	'Mismatch on "a"')


const FooKinds = {
	X: 100,
	Y: 200,
	Z: 300
}
const fooKindIsValid = val => Object.values(FooKinds).includes(val)

oks({ a: 200 },
	{ a: Where(fooKindIsValid) })
fails({ a: 999 },
	{ a: Where(fooKindIsValid) },
	'Mismatch on "a"')


// OptionalWhere

oks({},
	{ a: OptionalWhere(isEmptyString) })

oks({ a: '' },
	{ a: OptionalWhere(isEmptyString) })

fails({ a: 'non empty string' },
	{ a: OptionalWhere(isEmptyString) },
	'Mismatch on "a"')


// Shape
oks({
		a: {
			b: 0,
			c: 1
		}
	},
	{
		a: Shape({
			b: Number,
			c: Number
		})
	})

fails({
		a: {
			b: 0,
			c: 1
		}
	},
	{
		a: Shape({
			b: String,
			c: Number
		})
	},
	'Mismatch on "b"')

