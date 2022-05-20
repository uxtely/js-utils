import { base52 } from './base52.js'
import { strictEqual } from 'assert'


is(0, 'a')
is(1, 'b')
is(25, 'z')
is(26, 'A')
is(51, 'Z')
is(52, 'ba')
is(2 ** 30, 'cQSvTm')

function is(input, expected) {
	strictEqual(base52(input), expected)
}
