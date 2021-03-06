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
			this.video?? = videoEl
			this.video??.controls = false
			this.videoOverlay?? = null
			this.progressTrack?? = null
			this.progressBar?? = null

			this.addProgressControl??()
			this.registerListeners??()
		}

		VideoPlayer.prototype = {
			constructor: VideoPlayer,

			PlayOrPause: function () {
				if (this.canPlay??())
					this.Play()
				else
					this.Pause()
			},

			Play: function () {
				this.progressBar??.style.transition = progressBarTransition
				this.video??.play()
				this.videoOverlay??.querySelector('svg').style.opacity = 0
			},

			Pause: function () {
				this.progressBar??.style.transition = '' // Otherwise, it feels as a slow stop.
				this.video??.pause()
				this.videoOverlay??.querySelector('svg').style.opacity = 1
			},

			Rewind: function (seconds) {
				this.setTime??(Math.max(0, this.video??.currentTime - seconds))
			},

			FastForward: function (seconds) {
				this.setTime??(Math.min(this.video??.duration, this.video??.currentTime + seconds))
			},

			FullScreen: function () {
				if (isSafari)
					return

				var self = this
				this.video??.controls = true
				var video = this.video??
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
				this.video??.controls = false
			},


			canPlay??: function () {
				return this.video??.paused || this.video??.ended
			},

			addProgressControl??: function () {
				this.videoOverlay?? = this.renderOverlayPlayButton??()

				this.progressTrack?? = divc(cProgressTrack)
				this.progressBar?? = divc(cProgressBar)

				this.progressTrack??.appendChild(this.progressBar??)
				this.video??.parentNode.appendChild(this.videoOverlay??)
				this.video??.parentNode.appendChild(this.progressTrack??)

				this.timeStamp?? = divc(cTimeStamp)
				this.timeStamp??.innerHTML = '<span class="CurrentTime">0:00</span> / &nbsp;' + this.video??.getAttribute('data-duration') + '</div>'
				this.video??.parentNode.appendChild(this.timeStamp??)

				this.currentTimeIndicator?? = this.video??.parentNode.querySelector('.' + cCurrentTime)
			},

			renderOverlayPlayButton??: function () {
				var el = document.createElement('button')
				el.className = cOverlayBtn
				el.title = 'Play'
				el.type = 'button'
				el.innerHTML = '<svg class="' + cPlayCircleIcon + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
				return el
			},


			registerListeners??: function () {
				this.video??.addEventListener('timeupdate', this.onTimeUpdate??.bind(this))
				this.video??.addEventListener('ended', this.showVideoPoster??)
				this.progressTrack??.addEventListener('mousedown', this.onProgressTrackClick??.bind(this))
				this.videoOverlay??.addEventListener('click', this.onClick??.bind(this))
				this.video??.addEventListener('keydown', function (event) {
					if (!this.canPlay??() || (activePlayer === this))
						return

					if (
						event.keyCode === 13 || // Enter
						event.keyCode === 32   // Space
					) {
						event.preventDefault() // Prevents the page scroll
						this.onClick??()
					}
				}.bind(this))
			},

			onTimeUpdate??: function () {
				this.progressBar??.style.width = (this.video??.currentTime / this.video??.duration) * 100 + '%'
				this.currentTimeIndicator??.innerText = this.formattedTime??()
			},

			formattedTime??: function () {
				var time = this.video??.currentTime
				var minutes = time / 60 | 0
				var seconds = time % 60 | 0
				if (seconds < 10)
					seconds = '0' + seconds
				return minutes + ':' + seconds
			},

			onProgressTrackClick??: function (event) {
				var rect = this.progressTrack??.getBoundingClientRect()
				var pos = (event.clientX - rect.x) / rect.width
				this.setTime??(pos * this.video??.duration)
			},

			setTime??: function (time) {
				this.video??.currentTime = time
			},

			onClick??: function () {
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

			showVideoPoster??: function () {
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
