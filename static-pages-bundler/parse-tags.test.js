import test from 'node:test'
import { deepStrictEqual } from 'node:assert'
import { extractStyleSheetHrefs, extractJavaScriptSources, removeLineContaining } from './parse-tags.js'


const HTML = `
<html lang="en">
<head>
	<link rel="stylesheet" href="0.css">
	<link href="1.css"  rel="stylesheet" >
	<link href="2.css" rel="stylesheet">
	<link rel="dns-prefetch" href="//free.uidrafter.com">
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
	deepStrictEqual(extractStyleSheetHrefs(HTML), [
		'0.css', '1.css', '2.css'
	]))

test('Extracts JS files', () =>
	deepStrictEqual(extractJavaScriptSources(HTML), [
		'0.js', '1.js', '2.js'
	]))


test('Removes line containing X', () =>
	deepStrictEqual(removeLineContaining(HTML, 'href="0.css"'),
		`
<html lang="en">
<head>
	<link href="1.css"  rel="stylesheet" >
	<link href="2.css" rel="stylesheet">
	<link rel="dns-prefetch" href="//free.uidrafter.com">
</head>
<body>

<footer> Footer </footer>

<script src="0.js"></script>
	<script   src="1.js"  ></script>
	<script type="module"  src="2.js"></script>
</body>
</html>
`))
