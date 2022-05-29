import test from 'node:test'
import { deepStrictEqual, throws } from 'node:assert'
import { parseHeadAndBody } from './parseHeadAndBody.js'


test('Throws when missing closing head tag', () =>
	throws(() => parseHeadAndBody(`<head>ok <div>ok</div>`),
		/Missing .* <\/head>/))


test('Throws when the head tags are swapped', () =>
	throws(() => parseHeadAndBody(`</head>backwards<head> <div>bodyok</div>`),
		/.* Misplaced <\/head>/))


test('Empty head is OK', () =>
	deepStrictEqual(parseHeadAndBody(`<article>TEST_1_BODY</article>`),
		[
			'',
			`<article>TEST_1_BODY</article>`
		]))


test('Has Head and Body', () =>
	deepStrictEqual(parseHeadAndBody(`
    <head>
<title>Test2</title>
HEAD_CONTENT_LINE2
</head><article>THE_REST_T2</article>`),

		[
			`
<title>Test2</title>
HEAD_CONTENT_LINE2
`,
			`<article>THE_REST_T2</article>`
		]))


test('Excludes searching within comments', () =>
	deepStrictEqual(parseHeadAndBody(`
    <head>
<title>Test3</title>
<!-- </head> -->
HEAD_CONTENT_LINE3
</head><article>THE_REST_T3</article>`),

		[
			`
<title>Test3</title>

HEAD_CONTENT_LINE3
`,
			`<article>THE_REST_T3</article>`
		]))
