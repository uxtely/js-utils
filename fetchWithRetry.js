export function httpGet(route) {
	return fetchWithRetry(route, {
		credentials: 'include'
	})
}

function fetchWithRetry(url, options) {
	const maxRetries = 3
	const retryDelayIncrementMs = 1500

	return new Promise((resolve, reject) => {
		attemptFetch(1)

		function attemptFetch(nRetry) {
			fetch(url, options)
				.then(response => {
					if (nRetry <= maxRetries && isErrorStatus(response.status))
						retry(nRetry)
					else
						resolve(response)
				})
				.catch(error => {
					if (nRetry <= maxRetries)
						retry(nRetry)
					else
						reject(error)
				})
		}

		function retry(nRetry) {
			setTimeout(() => {
				attemptFetch(++nRetry)
			}, retryDelayIncrementMs * nRetry)
		}
	})
}

function isErrorStatus(code) {
	return code >= 500 && code < 600
}


