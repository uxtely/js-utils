function createElement(tagName, props, ...children) {
	const elem = document.createElement(tagName)
	if (props)
		for (const [key, value] of Object.entries(props))
			if (key === 'onChange')
				elem.addEventListener('change', value)
			else if (key === 'onClick')
				elem.addEventListener('click', value)
			else if (key === 'ref')
				value.current = elem
			else if (key === 'style')
				Object.assign(elem.style, value)
			else if (key in elem)
				elem[key] = value
			else
				elem.setAttribute(key, value)
	elem.append(...children.flat())
	return elem
}

function createSvgElement(tagName, props, ...children) {
	const elem = document.createElementNS('http://www.w3.org/2000/svg', tagName)
	for (const [key, value] of Object.entries(props))
		elem.setAttribute(key, value)
	elem.append(...children.flat())
	return elem
}

function useRef() {
	return { current: null }
}

