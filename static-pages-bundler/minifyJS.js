import { minify } from 'terser'


const TerserConfig = {
	compress: { passes: 2 }
}

export async function minifyJS(code) {
	return (await minify(code, TerserConfig)).code
}
