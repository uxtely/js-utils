/**
 * These random numbers (.0.0.1 change them) along with a random listening port
 * are equivalent to a 40-bit password to mitigate localhost spies. Although we
 * have CORS, the stylesheets and images could be seen by a malicious website.
 * https://news.ycombinator.com/item?id=20028108
 * http://http.jameshfisher.com/2019/05/26/i-can-see-your-local-web-servers/
 */

export const DevHost = '127.0.0.1' // See https://github.com/uxtely/ops-utils/blob/main/com.example.loopback1.plist

export function browser() {
	switch (process.platform) {
		case 'darwin':
			return 'open'

		case 'linux':
			return 'chromium' // or xdg-open

		default:
			return 'chrome'
	}
}
