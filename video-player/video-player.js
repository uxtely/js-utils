(function InitVideoPlayers() {
	// Disabling FullScreen in Safari as it messes up the layout after returning from FullScreen.
	const isSafari = !!window.safari // Needs a non file:// protocol to work

	const cContainer = 'vpRoot'
	const cOverlayBtn = 'vpOverlayBtn'
	const cPlayCircleIcon = 'vpPlayCircleIcon'
	const cProgressTrack = 'vpTrack'
	const cProgressBar = 'vpProgressBar'
	const cTimeStamp = 'vpTime'
	const cMuteBtn = 'vpMuteBtn'
	const cPlayOutsideBtn = 'vpPlayOutsideBtn'
	const attrDataDuration = 'data-duration'
	const attrHasExternalAudioVideoControls = 'data-show-external-av-controls'

	const msDoubleClickSpeed = 250
	let activePlayer = null
	let lastClickTime = 0

	function VideoPlayer(videoEl) {
		videoEl.controls = false

		// Private fields
		this.Videoº = videoEl
		this.MiddlePlayButtonº = null
		this.ProgressBarº = null
		this.CurrentTimeº = null
		this.shouldDisplayTimeStampº = Boolean(videoEl.getAttribute(attrDataDuration))
		this.shouldDisplayAVTogglerº = /1|true/.test(videoEl.getAttribute(attrHasExternalAudioVideoControls))

		videoEl.parentNode.appendChild(this.OverlayPlayButtonº())
		videoEl.parentNode.appendChild(this.Shadow3Dº())
		videoEl.parentNode.appendChild(this.Trackº())

		if (this.shouldDisplayTimeStampº)
			videoEl.parentNode.appendChild(this.TimeStampº())

		if (this.shouldDisplayAVTogglerº)
			this.PlayOutsideTogglerBtnº = videoEl.parentNode.appendChild(this.PlayOutsideTogglerº())

		if (this.shouldDisplayAVTogglerº) {
			this.MuteTogglerBtnº = videoEl.parentNode.appendChild(this.MuteTogglerº())
			this.MuteTogglerBtnº.addEventListener('click', this.onMuteToggleº.bind(this), true)
		}

		videoEl.parentNode.addEventListener('click', this.onClickº.bind(this))
		videoEl.addEventListener('timeupdate', this.onTimeUpdateº.bind(this))
		videoEl.addEventListener('ended', this.showVideoPosterº)
		videoEl.addEventListener('keydown', this.onKeyDownº.bind(this))
	}

	VideoPlayer.prototype = {
		constructor: VideoPlayer,

		PlayOrPause() {
			if (this.canPlayº())
				this.Play()
			else
				this.Pause()
		},

		Play() {
			this.Videoº.play()
			this.ProgressBarº.style.transition = 'width 250ms linear'
			this.MiddlePlayButtonº.style.opacity = 0 // Show only once so it doesn't obstruct when pausing
			this.updateExternalPlayPauseº()
		},

		Pause() {
			this.Videoº.pause()
			this.ProgressBarº.style.transition = '' // Otherwise, it feels as a slow stop.
			this.updateExternalPlayPauseº()
		},

		updateExternalPlayPauseº() {
			if (this.shouldDisplayAVTogglerº)
				this.PlayOutsideTogglerBtnº.replaceChildren(this.PlayTogglerIconº())
		},

		Rewind(seconds) {
			this.setTimeº(Math.max(0, this.Videoº.currentTime - seconds))
		},

		FastForward(seconds) {
			this.setTimeº(Math.min(this.Videoº.duration, this.Videoº.currentTime + seconds))
		},

		FullScreen() {
			if (isSafari || !this.Videoº.requestFullscreen)
				return

			this.Videoº.requestFullscreen()
				.then(() => {
					setTimeout(() => {
						if (this)
							this.Play()
					}, msDoubleClickSpeed * 1.2)
				})
		},

		HideControls() {
			this.Videoº.controls = false
		},

		setTimeº(time) {
			this.Videoº.currentTime = time
		},

		canPlayº() {
			return this.Videoº.paused || this.Videoº.ended
		},

		OverlayPlayButtonº() {
			const playIcon = makeSVG('0 0 24 24', '<path d="M8 5v14l11-7z"/>')
			playIcon.setAttribute('class', cPlayCircleIcon)
			this.MiddlePlayButtonº = playIcon

			return (
				make('button', {
					className: cOverlayBtn,
					title: 'Play',
					type: 'button'
				}, playIcon))
		},

		Shadow3Dº() {
			const shadow = makeSVG('0 0 1320 76', '<filter id="cublur"><feGaussianBlur stdDeviation="13,5"/></filter><path fill="#00000066" d="M 74,-9 H 1245 L 1298,38 659,13 22,38 Z" filter="url(#cublur)"/>')
			shadow.style.position = 'absolute'
			return shadow
		},

		Trackº() {
			this.ProgressBarº = divc(cProgressBar)
			const track = divc(cProgressTrack, this.ProgressBarº)
			track.addEventListener('click', this.onTrackClickº.bind(this), true)
			return track
		},

		onTrackClickº(event) {
			event.stopPropagation() // Otherwise, it pauses the video.
			const rect = event.currentTarget.getBoundingClientRect()
			const pos = (event.clientX - rect.x) / rect.width
			this.setTimeº(pos * this.Videoº.duration)
		},

		TimeStampº() {
			this.CurrentTimeº = document.createTextNode('0:00')
			return divc(cTimeStamp, [
				this.CurrentTimeº,
				document.createTextNode(' / ' + this.Videoº.getAttribute(attrDataDuration))
			])
		},

		onTimeUpdateº() {
			this.ProgressBarº.style.width = (this.Videoº.currentTime / this.Videoº.duration) * 100 + '%'

			if (this.shouldDisplayTimeStampº)
				this.CurrentTimeº.textContent = this.formattedTimeº()
		},

		formattedTimeº() {
			const time = this.Videoº.currentTime
			const minutes = time / 60 | 0
			let seconds = time % 60 | 0
			if (seconds < 10)
				seconds = '0' + seconds
			return minutes + ':' + seconds
		},

		MuteTogglerº() {
			return (
				make('button', {
					type: 'button',
					className: cMuteBtn,
					title: this.Videoº.muted ? 'Unmute' : 'Mute'
				}, this.MuteTogglerIconº()))
		},


		onMuteToggleº(event) { // capture
			event.stopPropagation() // prevents this.onClickº
			this.Videoº.muted = !this.Videoº.muted
			this.MuteTogglerBtnº.replaceChildren(this.MuteTogglerIconº())
		},

		MuteTogglerIconº() {
			return this.Videoº.muted
				? makeSVG('0 0 24 24', '<path fill="#e80000" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>')
				: makeSVG('0 0 24 24', '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>')
		},

		PlayOutsideTogglerº() {
			return (
				make('button', {
					type: 'button',
					className: cPlayOutsideBtn,
					title: 'Play or Pause'
				}, this.PlayTogglerIconº()))
		},

		PlayTogglerIconº() {
			return this.canPlayº()
				? makeSVG('0 0 24 24', '<path d="M8 5v14l11-7z"></path>')
				: makeSVG('0 0 24 24', '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>')
		},

		onKeyDownº(event) {
			if (!this.canPlayº() || (activePlayer === this))
				return

			if (
				event.keyCode === 13 || // Enter
				event.keyCode === 32   // Space
			) {
				event.preventDefault() // Prevents the page scroll
				this.onClickº()
			}
		},

		onClickº() {
			if (document.fullscreenElement) // Otherwise it can't pause it.
				return

			const currClickTime = Date.now()
			const isDoubleClick = (currClickTime - lastClickTime) < msDoubleClickSpeed
			lastClickTime = currClickTime

			let timeout = null

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
				timeout = setTimeout(() => {
					if (activePlayer === this)
						this.PlayOrPause()
					else {
						if (activePlayer) {
							activePlayer.HideControls()
							activePlayer.Pause()
						}
						activePlayer = this
						this.Play()
					}
				}, msDoubleClickSpeed)
			}
		},

		showVideoPosterº() {
			activePlayer.Pause()
			activePlayer = null
			const src = this.src
			this.src = ''
			this.src = src
		}
	}


	const videos = document.querySelectorAll('video')
	for (let i = 0; i < videos.length; i++)
		new VideoPlayer(videos[i])

	document.addEventListener('click', onBodyClick, true)
	document.addEventListener('keydown', onKeyDown)


	function onKeyDown(event) {
		if (!activePlayer)
			return

		const arrowsSeekSeconds = 2

		switch (event.keyCode) {
			case 27: // Escape
				activePlayer.HideControls()
				activePlayer.Pause()
				activePlayer = null
				break

			case 32: // Spacebar
				event.preventDefault() // Prevents page scroll
				activePlayer.PlayOrPause()
				break

			case 37: // Arrow Left
				activePlayer.Rewind(arrowsSeekSeconds * (event.shiftKey ? 2 : 1))
				break

			case 39: // Arrow Right
				activePlayer.FastForward(arrowsSeekSeconds * (event.shiftKey ? 2 : 1))
				break

			case 70: // Letter F
				activePlayer.FullScreen()
				break
		}
	}

	function onBodyClick(event) {
		if (!activePlayer)
			return

		let target = event.target
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

	function divc(className, children) {
		return make('div', { className: className }, children)
	}

	function make(tag, props, children) {
		const el = document.createElement(tag)

		for (const key in props)
			el[key] = props[key]

		if (Array.isArray(children))
			for (let i = 0; i < children.length; i++)
				el.appendChild(children[i])
		else if (children)
			el.appendChild(children)

		return el
	}

	function makeSVG(viewBox, innerHTML) {
		const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		el.setAttribute('viewBox', viewBox)
		el.innerHTML = innerHTML
		return el
	}

	function contains(str, className) { // Because ie11 doesn't support classList on SVG (the play btn)
		return RegExp('\\b' + className + '\\b').test(str)
	}
}())
