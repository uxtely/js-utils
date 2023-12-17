const Charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function toBase52(n) {
	let encoded = ''
	do {
		encoded = Charset[n % 52] + encoded
		n = (n / 52) | 0
	} while (n > 0)
	return encoded
}

export function fromBase52(str) {
	let j = 0
	let decoded = 0
	for (let i = str.length - 1; i >= 0; i--) 
		decoded += Charset.indexOf(str[i]) * (52 ** j++)
	return decoded
}
