(function handleShortcutsDisplay() {
	const isMac = navigator.userAgentData && navigator.userAgentData.platform
		? navigator.userAgentData.platform === 'macOS'
		: /Mac|iP/.test(navigator.platform)
	if (isMac) {
		var sheet = document.styleSheets[0]
		sheet.removeRule(0)
		sheet.insertRule('.win {display: none}', 0)
	}
}())


window.addEventListener('DOMContentLoaded', function () {
	(function flashHighlightWhenScrollingToFragments() { /* @KeepSync Blog */
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
				if (elPendingHighlightOff || el === elPendingHighlightOff) {
					elPendingHighlightOff.style.background = ''
					clearTimeout(highlightTimer)
				}
				el.style.background = FLASH_BG_COLOR
				elPendingHighlightOff = el
				highlightTimer = setTimeout(function () {
					el.style.background = ''
					elPendingHighlightOff = null
				}, 1800)
			}
			catch (_) {
				setTimeout(function () {})
			}
		}
	}());


	(function scrollToTopWhenClickingTheCurrentNavigationItem() {
		var cActiveNav = 'li.active'
		document.querySelector(cActiveNav).addEventListener('click', function () {
			window.scrollTo(0, 0)
		})
	}());


	(function InitVideoPlayers() {
		// TODO FullScreen should be a ToggleFullScreen() with kcF. Currently, it toggles fine with double click
		// TODO handle could not load video
		// TODO make fullscreen the current video on rotate phone to landscape

		// Disabling FullScreen in Safari as is messes up the layout after returning from FullScreen.
		var isSafari = !!window.safari // Needs a non file:// protocol to work

		var cContainer = 'VideoWrap' // different from www
		var cOverlayBtn = 'VideoOverlayBtn'
		var cPlayCircleIcon = 'PlayButton'
		var cProgressTrack = 'VideoTrack'
		var cProgressBar = 'VideoBar'
		var cTimeStamp = 'TimeStamp'
		var cCurrentTime = 'CurrentTime'

		var progressBarTransition = 'width 250ms linear'
		var arrowsSeekSeconds = 2

		var activePlayer = null
		var lastClickTime = 0
		var doubleClickSpeed_ms = 250

		function VideoPlayer(videoEl) {
			this.videoº = videoEl
			this.videoº.controls = false
			this.videoOverlayº = null
			this.progressTrackº = null
			this.progressBarº = null

			this.addProgressControlº()
			this.registerListenersº()
		}

		VideoPlayer.prototype = {
			constructor: VideoPlayer,

			PlayOrPause: function () {
				if (this.canPlayº())
					this.Play()
				else
					this.Pause()
			},

			Play: function () {
				this.progressBarº.style.transition = progressBarTransition
				this.videoº.play()
				this.videoOverlayº.querySelector('svg').style.opacity = 0
			},

			Pause: function () {
				this.progressBarº.style.transition = '' // Otherwise, it feels as a slow stop.
				this.videoº.pause()
				this.videoOverlayº.querySelector('svg').style.opacity = 1
			},

			Rewind: function (seconds) {
				this.setTimeº(Math.max(0, this.videoº.currentTime - seconds))
			},

			FastForward: function (seconds) {
				this.setTimeº(Math.min(this.videoº.duration, this.videoº.currentTime + seconds))
			},

			FullScreen: function () {
				if (isSafari)
					return

				var self = this
				this.videoº.controls = true
				var video = this.videoº
				if (video.requestFullscreen)
					video.requestFullscreen().then(function () {
						setTimeout(function () {
							if (self)
								self.Play()
						}, doubleClickSpeed_ms * 1.2)
					})
				else if (video.mozRequestFullScreen) video.mozRequestFullScreen()
				else if (video.webkitRequestFullScreen) video.webkitRequestFullScreen()
				else if (video.msRequestFullscreen) video.msRequestFullscreen()
			},

			HideControls: function () {
				this.videoº.controls = false
			},


			canPlayº: function () {
				return this.videoº.paused || this.videoº.ended
			},

			addProgressControlº: function () {
				this.videoOverlayº = this.renderOverlayPlayButtonº()

				this.progressTrackº = divc(cProgressTrack)
				this.progressBarº = divc(cProgressBar)

				this.progressTrackº.appendChild(this.progressBarº)
				this.videoº.parentNode.appendChild(this.videoOverlayº)
				this.videoº.parentNode.appendChild(this.progressTrackº)

				this.timeStampº = divc(cTimeStamp)
				this.timeStampº.innerHTML = '<span class="CurrentTime">0:00</span> / &nbsp;' + this.videoº.getAttribute('data-duration') + '</div>'
				this.videoº.parentNode.appendChild(this.timeStampº)

				this.currentTimeIndicatorº = this.videoº.parentNode.querySelector('.' + cCurrentTime)
			},

			renderOverlayPlayButtonº: function () {
				var el = document.createElement('button')
				el.className = cOverlayBtn
				el.title = 'Play'
				el.type = 'button'
				el.innerHTML = '<svg class="' + cPlayCircleIcon + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
				return el
			},


			registerListenersº: function () {
				this.videoº.addEventListener('timeupdate', this.onTimeUpdateº.bind(this))
				this.videoº.addEventListener('ended', this.showVideoPosterº)
				this.progressTrackº.addEventListener('mousedown', this.onProgressTrackClickº.bind(this))
				this.videoOverlayº.addEventListener('click', this.onClickº.bind(this))
				this.videoº.addEventListener('keydown', function (event) {
					if (!this.canPlayº() || (activePlayer === this))
						return

					if (
						event.keyCode === 13 || // Enter
						event.keyCode === 32   // Space
					) {
						event.preventDefault() // Prevents the page scroll
						this.onClickº()
					}
				}.bind(this))
			},

			onTimeUpdateº: function () {
				this.progressBarº.style.width = (this.videoº.currentTime / this.videoº.duration) * 100 + '%'
				this.currentTimeIndicatorº.innerText = this.formattedTimeº()
			},

			formattedTimeº: function () {
				var time = this.videoº.currentTime
				var minutes = time / 60 | 0
				var seconds = time % 60 | 0
				if (seconds < 10)
					seconds = '0' + seconds
				return minutes + ':' + seconds
			},

			onProgressTrackClickº: function (event) {
				var rect = this.progressTrackº.getBoundingClientRect()
				var pos = (event.clientX - rect.x) / rect.width
				this.setTimeº(pos * this.videoº.duration)
			},

			setTimeº: function (time) {
				this.videoº.currentTime = time
			},

			onClickº: function () {
				var currClickTime = Date.now()
				var isDoubleClick = (currClickTime - lastClickTime) < doubleClickSpeed_ms
				lastClickTime = currClickTime

				var timeout = null

				if (isDoubleClick) {
					this.FullScreen()
					if (activePlayer && activePlayer !== this) {
						activePlayer.HideControls()
						activePlayer.Pause()
						activePlayer = this
					}
					clearTimeout(timeout)
				}
				else {
					var self = this
					timeout = setTimeout(function () {
						if (activePlayer === self)
							self.PlayOrPause()
						else {
							if (activePlayer) {
								activePlayer.HideControls()
								activePlayer.Pause()
							}
							activePlayer = self
							self.Play()
						}
					}, doubleClickSpeed_ms)
				}
			},

			showVideoPosterº: function () {
				activePlayer.Pause()
				activePlayer = null
				var src = this.src
				this.src = ''
				this.src = src
			}
		}


		var videos = document.querySelectorAll('video')
		for (var i = 0; i < videos.length; i++)
			new VideoPlayer(videos[i])

		document.addEventListener('click', onBodyClick, true)
		document.addEventListener('keydown', onKeyDown)


		function onKeyDown(event) {
			var kcEsc = 27
			var kcSpace = 32
			var kcArrowLeft = 37
			var kcArrowRight = 39
			var kcLetterF = 70

			if (!activePlayer)
				return

			switch (event.keyCode) {
				case kcEsc:
					activePlayer.HideControls()
					activePlayer.Pause()
					activePlayer = null
					break

				case kcSpace:
					event.preventDefault() // Prevents page scroll
					activePlayer.PlayOrPause()
					break

				case kcArrowLeft:
					activePlayer.Rewind(arrowsSeekSeconds * (event.shiftKey ? 2 : 1))
					break

				case kcArrowRight:
					activePlayer.FastForward(arrowsSeekSeconds * (event.shiftKey ? 2 : 1))
					break

				case kcLetterF:
					activePlayer.FullScreen()
					break
			}
		}

		function onBodyClick(event) {
			if (!activePlayer)
				return

			var target = event.target
			while (target) {
				if (target === document) {
					activePlayer.Pause()
					activePlayer = null
				}
				if (contains(target.className, cContainer))
					return
				target = target.parentNode
			}
		}

		function divc(className) {
			var el = document.createElement('div')
			el.className = className
			return el
		}
		function contains(str, className) { // Because ie11 doesn't support classList on SVG (the play btn)
			return RegExp('\\b' + className + '\\b').test(str)
		}
	}());


	(function AddRelNoOpener() {
		var links = document.querySelectorAll('a')
		for (var i = 0; i < links.length; i++)
			links[i].rel = 'noopener'
	}());
})
