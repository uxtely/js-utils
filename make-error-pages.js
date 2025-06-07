#!/usr/bin/env node
import { writeFileSync } from 'node:fs'

// The error pages have no extension, see
// https://blog.uxtly.com/pretty-routes-for-static-html
[
	'./static-pages-bundler/example-blog/root/root-meta/',
	'./static-pages-bundler/example-docs/root/root-meta/'
]
	.forEach(dir => {
		make(dir, 400, 'Bad Request')
		make(dir, 401, 'Unauthorized')
		make(dir, 403, 'Forbidden')
		make(dir, 404, 'Not Found')
		make(dir, 503, 'Rate Limited')
		make(dir, 'SORRY', 'Something went wrong.<br>Please try again.', '#7b0452')
	})


function make(dir, statusCode, title, bgcolor = '#e43838') {
	console.log('Saving', dir + statusCode)

	writeFileSync(dir + String(statusCode),
		`<!DOCTYPE html>
<html lang="en">
<head>
<meta name="viewport" content="width=device-width">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<title>${statusCode} ${title.replace('<br>', ' ')}</title>
<style>
body {
	font-family: Futura, system-ui, sans-serif;
	background: ${bgcolor};
	color: #fff;
	padding: 0;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
}
h1 {
	font-size: 66px;
	margin: 0 10px 0 0;
}
p {
	font-size: 19px;
	opacity: 0.8
}
@media (max-width: 440px) {
	body {
		flex-direction: column;
		text-align: center;
	}
}
</style>
</head>
<body>
	<h1>${statusCode}</h1>
	<p>${title}</p>
</body>
</html>
`, 'utf8')
}


