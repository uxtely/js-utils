/**
 * Copyright (c) Uxtely LLC. All rights reserved. Licensed under the ISC
 * license found in the LICENSE file in the root directory of this source tree.
 */

const typeOf = example => Object.prototype.toString.call(example)
const isTypeOf = example => value => typeOf(value) === typeOf(example)

const typeCheckers = new Map([
	[Date, isTypeOf(new Date())],
	[Array, isTypeOf([])],
	[String, isTypeOf('')],
	[Object, isTypeOf({})],
	[BigInt, isTypeOf(1n)],
	[Number, isTypeOf(1)],
	[RegExp, isTypeOf(/a/)],
	[Boolean, isTypeOf(true)],
	[Function, isTypeOf(a => a)],

	[Int8Array, isTypeOf(new Int8Array())],
	[Int16Array, isTypeOf(new Int16Array())],
	[Int32Array, isTypeOf(new Int32Array())],
	[BigInt64Array, isTypeOf(new BigInt64Array())],

	[Uint8Array, isTypeOf(new Uint8Array())],
	[Uint16Array, isTypeOf(new Uint16Array())],
	[Uint32Array, isTypeOf(new Uint32Array())],
	[BigUint64Array, isTypeOf(new BigUint64Array())],
	[Uint8ClampedArray, isTypeOf(new Uint8ClampedArray())],

	[Float32Array, isTypeOf(new Float32Array())],
	[Float64Array, isTypeOf(new Float64Array())]
])

export const Shape = shape => (_, value) => check(value, shape)
export const Optional = type => (hasArg, value, name) => hasArg && checkMatch(type, value, name)
export const OptionalWhere = conditionFn => (hasArg, value, name) => hasArg && checkWhere(conditionFn, value, name)
export const Where = conditionFn => (hasArg, value, name) => {
	checkRequired(hasArg, name)
	return checkWhere(conditionFn, value, name)
}

export function check(valueArg, typeDef) {
	if (typeCheckers.has(typeDef)) // is non-object-literal arg, e.g., check('a', String)
		return checkMatch(typeDef, valueArg, '')

	checkArgsHaveDef(valueArg, typeDef)
	for (const [name, type] of Object.entries(typeDef))
		if (typeCheckers.has(type)) {
			checkRequired(name in valueArg, name)
			checkMatch(type, valueArg[name], name)
		}
		else
			type(name in valueArg, valueArg[name], name)
	return valueArg
}

function checkArgsHaveDef(args, defs) {
	if (!isTypeOf({})(args)) throw TypeError('Expected an object literal as argument')
	if (!isTypeOf({})(defs)) throw TypeError('Expected an object literal as type definitions')
	for (const name of Object.keys(args))
		if (!(name in defs))
			throw TypeError(`Missing type definition for "${name}"`)
}

function checkRequired(hasArg, name) {
	if (!hasArg)
		throw TypeError(`Missing argument "${name}"`)
}

function checkMatch(type, value, name) {
	if (!typeCheckers.get(type)(value))
		throw TypeError(name
			? `Mismatch on "${name}"`
			: `Got: "${typeOf(value)}"`)
	return value
}

function checkWhere(conditionFnOrConstructor, value, name) {
	if (typeCheckers.has(conditionFnOrConstructor))
		return checkMatch(conditionFnOrConstructor, value, name)
	if (!conditionFnOrConstructor(value))
		throw TypeError(`Mismatch on "${name}"`)
}
