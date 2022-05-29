import { minify } from 'terser'


const TerserConfig = {
	compress: { passes: 2 },
	mangle: { properties: { regex: /º$/ } }
}

export async function minifyJS(code) {
	return (await minify(code, TerserConfig)).code
}
