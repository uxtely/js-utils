import crypto from 'crypto'

export const cspNonce = data => data
	? 'sha256-' + crypto.createHash('sha256').update(data).digest('base64')
	: '';
