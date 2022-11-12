import test from 'node:test'
import { equal } from 'node:assert/strict'
import { base52, base52Decode } from './base52.js'


is(0, 'A')
is(1, 'B')
is(25, 'Z')
is(26, 'a')
is(51, 'z')
is(52, 'BA')
is(2 ** 30, 'CqsVtM')

function is(decoded, encoded) {
	test(`Encode: ${decoded} => ${encoded}`, () =>
		equal(base52(decoded), encoded))
	
	test(`Decode: ${encoded} => ${decoded}`, () =>
		equal(base52Decode(encoded), decoded))
}
