'use strict';

/**
 * Kept as .cjs so `enact pack --framework` does not glob it as an @enact entry
 * (that would pull in docs-utils → shelljs → child_process).
 *
 * `@enact/docs-utils` standalone mode only searches `*.js`. After the TypeScript
 * migration, module JSDoc also lives in `.ts`/`.tsx`, so those files must be
 * parsed or `@mixes`/`@extends`/`@link` targets resolve as invalid.
 *
 * This wrapper finds those files (skipping tests/deps) and reuses docs-utils'
 * parser. Require the package without `--standalone` so its CLI `init()` is a no-op.
 */

const fs = require('fs');
const path = require('path');
const docs = require('@enact/docs-utils');

const excludedDirs = new Set(['build', 'node_modules', 'sampler', 'samples', 'tests', 'dist', 'coverage', 'scripts']);
const sourceExts = new Set(['.js', '.ts', '.tsx']);
const moduleTag = /^\s*\*\s*@module\s/m;

function findModuleFiles (dir, acc = []) {
	let entries;
	try {
		entries = fs.readdirSync(dir, {withFileTypes: true});
	} catch (_err) {
		return acc;
	}

	for (const entry of entries) {
		if (entry.name.startsWith('.')) continue;

		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (!excludedDirs.has(entry.name)) findModuleFiles(full, acc);
			continue;
		}

		if (!sourceExts.has(path.extname(entry.name)) || entry.name.endsWith('.d.ts')) continue;

		const content = fs.readFileSync(full, 'utf8');
		if (moduleTag.test(content)) acc.push(full);
	}

	return acc;
}

const files = findModuleFiles(process.cwd());

if (files.length === 0) {
	process.stderr.write('validate-docs: no @module files found\n');
	process.exit(2);
}

docs.getDocumentation(files, true, true).then(() => {
	docs.postValidate(true, true);
	process.exit(process.exitCode || 0);
}).catch((err) => {
	process.stderr.write(`${err}\n`);
	process.exit(2);
});
