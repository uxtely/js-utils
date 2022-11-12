const Charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function base52(n) {
	let encoded = ''
	do {
		encoded = Charset[n % 52] + encoded
		n = (n / 52) | 0
	} while ( n > 0 )
	return encoded
}


export function base52Decode(str) {
	let i = 0
	let decoded = 0
	for (let j = str.length - 1; j >= 0; j--)
		decoded += Charset.indexOf(str[j]) * (52 ** i++)
	return decoded
}
