import { describe, test } from 'node:test'
import { deepEqual, throws } from 'node:assert/strict'
import {
	parseHeadAndBody,
	extractStyleSheetHrefs,
	extractJavaScriptSources,
	removeLineContaining
} from './parsers.js'


describe('Parsers', () => {
	const HTML = `
<html lang="en">
<head>
	<link rel="stylesheet" href="0.css">
	<link href="1.css"  rel="stylesheet" >
	<link href="2.css" rel="stylesheet">
	<link rel="dns-prefetch" href="https://my.uxtly.com">
</head>
<body>

<footer> Footer </footer>

<script src="0.js"></script>
	<script   src="1.js"  ></script>
	<script type="module"  src="2.js"></script>
</body>
</html>
`

	test('Extracts CSS files', () =>
		deepEqual(extractStyleSheetHrefs(HTML), [
			'0.css', '1.css', '2.css'
		]))

	test('Extracts JS files', () =>
		deepEqual(extractJavaScriptSources(HTML), [
			'0.js', '1.js', '2.js'
		]))


	test('Removes line containing X', () =>
		deepEqual(removeLineContaining(HTML, 'href="0.css"'),
			`
<html lang="en">
<head>
	<link href="1.css"  rel="stylesheet" >
	<link href="2.css" rel="stylesheet">
	<link rel="dns-prefetch" href="https://my.uxtly.com">
</head>
<body>

<footer> Footer </footer>

<script src="0.js"></script>
	<script   src="1.js"  ></script>
	<script type="module"  src="2.js"></script>
</body>
</html>
`))


	/* === parseHeadAndBody === */


	test('Throws when missing closing head tag', () =>
		throws(() => parseHeadAndBody(`<head>ok <div>ok</div>`),
			/Missing .* <\/head>/))


	test('Throws when the head tags are swapped', () =>
		throws(() => parseHeadAndBody(`</head>backwards<head> <div>bodyok</div>`),
			/.* Misplaced <\/head>/))


	test('Empty head is OK', () =>
		deepEqual(parseHeadAndBody(`<article>TEST_1_BODY</article>`),
			[
				'',
				`<article>TEST_1_BODY</article>`
			]))


	test('Has Head and Body', () =>
		deepEqual(parseHeadAndBody(`
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
		deepEqual(parseHeadAndBody(`
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
})
