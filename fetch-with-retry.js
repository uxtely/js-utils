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
	const attempts = [1500, 2800, 5000] // milliseconds

	return new Promise((resolve, reject) => {
		attemptFetch(0)

		function attemptFetch(nRetry) {
			fetch(url, options)
				.then(response => {
					if (nRetry < attempts.length
						&& response.status >= 500
						&& response.status < 600)
						retry(nRetry)
					else
						resolve(response)
				})
				.catch(error => {
					if (nRetry < attempts.length)
						retry(nRetry)
					else
						reject(error)
				})
		}

		function retry(nRetry) {
			setTimeout(() => {
				attemptFetch(++nRetry)
			}, attempts[nRetry])
		}
	})
}

