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
	const msAttemptsAt = [1500, 2800, 5000]

	return new Promise((resolve, reject) => {
		attemptFetch(0)

		function attemptFetch(nRetry) {
			fetch(url, options)
				.then(response => {
					if (nRetry < msAttemptsAt.length
						&& response.status >= 500
						&& response.status < 600)
						retry(nRetry)
					else
						resolve(response)
				})
				.catch(error => {
					if (nRetry < msAttemptsAt.length)
						retry(nRetry)
					else
						reject(error)
				})
		}

		function retry(nRetry) {
			setTimeout(() => {
				attemptFetch(++nRetry)
			}, msAttemptsAt[nRetry])
		}
	})
}

