window.addEventListener('DOMContentLoaded', function () {
	(function flashHighlightWhenScrollingToFragments() { /* @KeepSync UserDocs */
		var FLASH_BG_COLOR = '#77ffc4'
		var elPendingHighlightOff = null
		var highlightTimer = null

		if (location.hash)
			highlightSectionTitle(location.hash)

		var anchors = document.querySelectorAll('a')
		for (var i = 0; i < anchors.length; i++)
			if (anchors[i].hash)
				anchors[i].addEventListener('click', highlightSectionTitle.bind(null, anchors[i].hash))

		function highlightSectionTitle(fragmentName) {
			try {
				var el = document.querySelector(fragmentName).nextElementSibling
				if (el && el.tagName === 'DETAILS' && !el.open)
					el.open = true

				if (elPendingHighlightOff || el === elPendingHighlightOff) {
					elPendingHighlightOff.style.background = ''
					clearTimeout(highlightTimer)
				}
				el.style.background = FLASH_BG_COLOR
				elPendingHighlightOff = el
				highlightTimer = setTimeout(function () {
					el.style.background = ''
					elPendingHighlightOff = null
				}, 2100)
			}
			catch (_) {
				setTimeout(function () {})
			}
		}
	}());


	(function AddRelNoOpener() {
		var links = document.querySelectorAll('a')
		for (var i = 0; i < links.length; i++)
			links[i].rel = 'noopener'
	}())


	setTimeout(function InjectContactAndAuthorEmail() {
		var emailZone = [
			'm', 'o', 'c',
			'.',
			'r', 'e', 't', 'f', 'a', 'r', 'd', 'i', 'u',
			String.fromCharCode(64) // @
		].reverse().join('')
		var linkEl = document.getElementById('cor')
		var email = linkEl.hash.replace('#', '') + emailZone
		linkEl.href = 'mailto:' + email
		linkEl.innerText = email

		var authorEl = document.querySelector('.Author a')
		if (authorEl) {
			var aEmail = authorEl.pathname.replace('/', '') + emailZone
			authorEl.href = 'mailto:' + aEmail
			authorEl.title = aEmail
		}
	}, 200)
})
