const Charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function base52(n) {
	let str = ''
	do {
		str = Charset[n % 52] + str
		n = (n / 52) | 0
	} while (n > 0)
	return str
}
