export function httpGet(route) {
	return fetchWithRetry(route, {
		credentials: 'include'
	})
}

export function httpPost(route, json) {
	return fetchWithRetry(route, {
		body: json,
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		credentials: 'include'
	})
}


function fetchWithRetry(url, options) {
	const AttemptAt = [0, 1500, 3000, 5000] // milliseconds
	const isError = status => status >= 500 && status < 600
	return new Promise((resolve, reject) => {
		(function attemptFetch() {
			setTimeout(() => {
				fetch(url, options).then(response => {
					if (isError(response.status) && AttemptAt.length)
						attemptFetch()
					else
						resolve(response)
				}).catch(error => {
					if (AttemptAt.length)
						attemptFetch()
					else
						reject(error)
				})
			}, AttemptAt.shift())
		}())
	})
}