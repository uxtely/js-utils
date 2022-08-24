import https from 'node:https'
import { basename, join } from 'node:path'
import { readFileSync, readdirSync, lstatSync } from 'node:fs'


/**
 *  At UI Drafter we no longer use CDNs, but here's how we used to do it:
 *   - upload new .mp4 of the `localDir`
 *     - ignores subdirectories
 *     - skips already uploaded videos
 *   - use BunnyCDN's web API because the alternative is clear text FTP.
 *		Ideally, they should implement `rsync` access so this script shouldn't be needed.
 *			https://support.bunnycdn.com/hc/en-us/community/posts/360047869832-rsync-support
 *
 *	In Cloudflare, we alias the BunnyCDN domain.
 *    CNAME v.example.com => example.b-cdn.net
 *	That way switching CDN (e.g. for failover) is just a matter of a DNS record change.
 */

const BUNNY_CREDENTIAL_HEADER = { // TODO to env var
	AccessKey: 'same-as-your-ftp-password'
}
const BUNNY_STORAGE_ZONE = 'enter-your-zone-name'

export async function uploadVideosToBunnyCDN(localDir, zoneDir) {
	await uploadMissingFiles(
		localDir,
		'.mp4',
		`https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${zoneDir}`)
}

async function uploadMissingFiles(dir, ext, bunnyURL) {
	try {
		const candidates = listFilesWithoutDirs(dir).filter(f => f.endsWith(ext))
		const alreadyUploaded = await listAlreadyUploadedFiles(bunnyURL)
		const toUpload = candidates.filter(f => !alreadyUploaded.has(f))
		if (toUpload.length)
			Promise
				.all(toUpload.map(f => putFile(`${bunnyURL}/${f}`, `${dir}/${f}`)))
				.catch(console.error)
		else
			console.log(`No ${ext} needed to be uploaded to BunnyCDN.`)
	}
	catch (error) {
		console.error(error)
	}
}

function listAlreadyUploadedFiles(url) {
	return request(`${url}/`, {
		method: 'GET',
		headers: { Accept: 'application/json' }
	})
		.then(res => {
			if (res.statusCode !== 200)
				throw res.statusCode

			const body = JSON.parse(res.body)
			const saved = new Set()
			for (const f of body)
				saved.add(f.ObjectName)
			return saved
		})
}

function putFile(url, file) {
	console.log('Uploading to BunnyCDN', basename(url))
	const data = readFileSync(file)
	return request(url, {
		method: 'PUT',
		headers: { 'Content-Length': Buffer.byteLength(data) },
		body: data
	})
}

function request(url, { method, headers, body = '' }) {
	return new Promise((resolve, reject) => {
		https.request(url, {
				method,
				headers: Object.assign(headers, BUNNY_CREDENTIAL_HEADER)
			},
			response => {
				response.setEncoding('utf8')
				response.body = ''
				response.on('data', chunk => { response.body += chunk })
				response.on('end', () => resolve(response))
			}
		)
			.on('error', reject)
			.end(body)
	})
}

function listFilesWithoutDirs(dir) {
	return readdirSync(dir).filter(f => lstatSync(join(dir, f)).isFile())
}

