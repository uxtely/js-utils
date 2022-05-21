window.addEventListener('load', function () {
	// Optional helpers
	const div = createElement.bind(null, 'div')
	const label = createElement.bind(null, 'label')
	const input = createElement.bind(null, 'input')
	const button = createElement.bind(null, 'button')

	const refWidthInput = useRef()
	const refHeightInput = useRef()
	const refOutputBox = useRef()

	document.getElementById('ReactCreateElementExample').append(
		createElement('p', null, 'Output:'),
		div({ className: 'Controls' },
			label(null, 'Width', input({
				ref: refWidthInput,
				onChange: update,
				value: 100,
				autofocus: true
			})),
			label(null, 'Height', input({
				ref: refHeightInput,
				onChange: update,
				value: 80
			})),

			button({
				type: 'button',
				style: { fontWeight: 'bold', padding: '5px 8px', border: 0  },
				onClick() {
					refOutputBox.current.style.border = !refOutputBox.current.style.border
						? '3px solid black'
						: ''
				}
			}, 'Toggle Border')
		),

		div({ className: 'Box', ref: refOutputBox }),

		createSvgElement({
			viewBox: '0 0 240 240',
			class: 'CoffeeIcon',
			width: 80
		}, '<path d="m177 51.4-7.84-27.4h-99l-7.84 27.4h-17.1v35.3h12.3l11.8 129h101l11.8-129h12.3v-35.3zm-17.6 153h-79.4l-1.42-15.7h82.2zm2.49-27.4h-84.4l-5.7-62.7h95.8zm6.77-74.4h-97.9l-1.42-15.7h101zm13.7-27.4h-125v-11.8h86.2v-11.8h-68.6l4.48-15.7h81.3l4.48 15.7h-9.84v11.8h27.4z" />')
	)

	update()
	function update() {
		refOutputBox.current.style.width = parseInt(refWidthInput.current.value, 10) + 'px'
		refOutputBox.current.style.height = parseInt(refHeightInput.current.value, 10) + 'px'
	}
})
