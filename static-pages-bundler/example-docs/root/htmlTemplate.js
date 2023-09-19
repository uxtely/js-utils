import { parseHeadAndBody } from '../../parsers.js'


export default function htmlTemplate(RouteDefs, html, iRoute) {
	const [head, body] = parseHeadAndBody(html.toString())
	const [, title] = RouteDefs[iRoute]
	const [nextRoute, nextTitle] = iRoute < (RouteDefs.length - 1)
		? RouteDefs[iRoute + 1]
		: [null, null]

	const nextPagePrefetch = nextRoute
		? `<link rel="prefetch" href="${nextRoute}" importance="low">`
		: ''
	const nextPageLink = nextRoute
		? `<a tabindex="0" class="NextDoc" href="${nextRoute}">Next <b>${nextTitle}</b> &nbsp;️⇾</a>`
		: ''

	const navItems = RouteDefs.map(([route, defTitle, hasDivider]) => {
		const cName = hasDivider ? 'divider' : ''
		return defTitle === title
			? `<li class="${cName} active"><span>${defTitle}</span></li>`
			: `<li ${cName ? `class="${cName}"` : ''}><a tabindex="0" href="${route}">${defTitle}</a></li>`
	}).join('')

	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta name="viewport" content="width=device-width">
		
		<title>${title}</title>
		
		<link rel="icon" href="favicon.svg" type="image/svg+xml">
		<link rel="apple-touch-icon" href="favicon-apple-touch-icon.png">
		
		<link rel="stylesheet" href="assets/base.css">
		${head}
		
    ${nextPagePrefetch}
	  <link rel="dns-prefetch" href="//uidrafter.com">
	</head>
	<body>
	<header>
		<a tabindex="0" href="//uidrafter.com" title="Website">
		<svg class="Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 20">
			<path class="LetterU1" d="m7.18 5.12c.813.0218.544 4.63.399 6.77-.317 2.16-1.72 3.18-2.62 1.58-.491-.873-1.29-6.11.0982-8.65" />
			<path class="LetterU1" d="m10 4.16c.0742 2.06-.0736 8.52.132 11-.156.812-3.75.944-3.75.944-.123-.218 1.29-1.25 1.45-2.18.433-2.62.32-7.5.791-9.97" />
			<path class="LetterU0" d="m3.8 5.14 1.26-.324-.0114 6.4c0 .999.0582 2.27.991 2.28.925-.0241.938-1.55.969-2.22l.00875-6.88 1.65-.436-.0753 8.03c-.0757 2.41-.682 4.19-2.3 4.13-2.33-.118-2.43-3.29-2.47-4.39z" />
			<path class="LetterI0" d="m11.8 3.23.0437 13.6-1.87-.304-.00778-12.9" />
			<path class="LetterD1" d="m12.3 13.6c1.68.145 2.65-1.09 2.71-3.2.0613-1.71-.495-3.47-2.92-3.79 1.5.155 4.74-1.39 5.63 3.17-.477 3.44-2.96 4.97-5.44 3.82z" />
			<path class="LetterD0" d="m11.7 3.23.113 13.6s3.47-.466 3.58-.502c.346-.0452 3.62-1.33 3.39-6.46-.221-4.77-3.21-5.74-3.62-5.86-.952-.321-3.48-.792-3.48-.792zm2.45 3.35.876.123s1.93.346 1.94 3.43c0 3.47-2.17 3.56-2.17 3.56l-.661.01z" />
			<path class="Letters" fill="#fff" d="m76.6 8.81h1.66v.864h.021q.266-.499.631-.743.366-.253.918-.253.144 0 .29.016.143.016.264.0447v1.52q-.177-.056-.354-.077-.166-.034-.354-.034-.476 0-.753.133t-.431.376q-.145.233-.189.564-.044.333-.044.731v2.25h-1.66zm-1.26 4.45q-.399.51-1.01.786-.609.277-1.26.277-.62 0-1.17-.2-.543-.2-.953-.565-.397-.377-.63-.896-.233-.52-.233-1.16 0-.642.233-1.16.233-.521.63-.886.41-.378.953-.576.554-.199 1.17-.199.576 0 1.04.199.476.198.796.576.333.365.509.886.177.52.177 1.16v.52h-3.85q.099.475.432.764.332.276.819.276.41 0 .686-.177.287-.189.498-.476zm-1.41-2.37q.016-.42-.277-.719-.287-.299-.742-.299-.276 0-.486.0891-.21.088-.366.231-.144.134-.233.322-.078.176-.087.376zm-4.53-.752h-1.46v1.79c0 .146 0 .284.023.409.016.118.047.221.099.31.052.09.129.159.233.211.11.044.254.066.431.066.09 0 .203 0 .343-.022.148-.023.258-.067.332-.134v1.38c-.184.066-.376.11-.576.134-.199.022-.394.033-.586.033-.282 0-.54-.03-.775-.09-.236-.058-.443-.151-.62-.277-.177-.132-.318-.301-.422-.509-.095-.207-.143-.458-.143-.752v-2.56h-.998v-1.33h.999v-1.59h1.66v1.59h1.46zm-7.29 0h-1.1v-1.33h1.1v-.952c0-.295.026-.573.077-.832.052-.266.151-.499.299-.696.146-.2.356-.356.63-.466.281-.118.647-.177 1.1-.177.17 0 .336 0 .497.0216.162.016.32.0407.476.0782l-.077 1.41c-.095-.0375-.184-.0631-.266-.0774-.08-.0223-.172-.0327-.276-.0327-.266 0-.466.0591-.598.177-.133.111-.2.343-.2.698v.852h1.17v1.33h-1.17v4.05h-1.66zm-3.14 3.38h-.022q-.276.432-.74.62-.455.189-.964.189-.376 0-.73-.11-.343-.1-.609-.31-.266-.212-.422-.522-.154-.31-.154-.719 0-.466.166-.786.177-.321.464-.532.299-.209.676-.32.376-.122.775-.177.41-.055.808-.066.41-.016.753-.016 0-.442-.321-.697-.311-.266-.742-.266-.409 0-.753.177-.332.166-.598.466l-.886-.909q.465-.432 1.08-.642.62-.22 1.28-.22.73 0 1.2.187.476.176.752.532.289.354.399.875.11.509.11 1.18v2.73h-1.53zm-.41-1.68q-.189 0-.476.021-.277.016-.543.09-.253.077-.443.233-.177.154-.177.43 0 .3.254.443.255.145.532.145.243 0 .466-.066.231-.066.409-.189.177-.121.277-.31.11-.187.11-.444v-.353zm-7.47-3.02h1.66v.864h.022q.264-.499.631-.743.365-.253.919-.253.143 0 .289.016.144.016.264.0447v1.52q-.177-.056-.353-.077-.167-.034-.354-.034-.476 0-.754.133-.276.133-.43.376-.144.233-.189.564-.044.333-.044.731v2.25h-1.66zm-8.19-2.46h2.59q.941 0 1.78.211.852.211 1.48.688.631.464.997 1.22.376.752.376 1.83 0 .952-.366 1.68-.355.719-.963 1.22-.609.486-1.41.743-.796.253-1.67.253h-2.82zm1.73 6.24h.897q.598 0 1.11-.122.52-.121.896-.398.376-.288.586-.742.222-.465.222-1.13 0-.576-.222-.997-.21-.431-.576-.709-.364-.277-.863-.409-.487-.143-1.03-.143h-1.02zm-8.3-6.24h1.73v7.84h-1.73zm-1.57 4.82q0 .698-.21 1.28-.21.587-.631 1.02-.41.432-1.03.675-.62.244-1.43.244-.82 0-1.44-.244-.621-.242-1.04-.675-.409-.433-.62-1.02-.211-.585-.211-1.28v-4.82h1.73v4.75q0 .366.112.676.121.31.331.543.212.22.499.354.3.122.643.122t.63-.122q.289-.134.499-.354.21-.233.322-.543.121-.31.121-.676v-4.75h1.73z" />
		</svg>
		</a>
	</header>

	<label for="hamburger">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
		</svg>
	</label>
	<input type="checkbox" id="hamburger">

	<nav>
		<ul>${navItems}</ul>
	</nav>

  <main id="main">
    ${body}
	</main>
	${nextPageLink}
	<footer><a target="_blank" href="//uxtely.com">&copy; 2022 Uxtely LLC</a></footer>
	<script src="assets/base.js"></script>
</body>
</html>
`
}
