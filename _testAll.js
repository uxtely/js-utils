#! /usr/bin/env node
import { resolve } from 'node:path'
import { listFilesRecursively } from './fs-utils.js'


Promise.all(listFilesRecursively('.', /\.test\.js$/).map(f => import(resolve(f))))
	.then(() => { console.log('✓ All tests passed') })
	.catch(console.error)

