import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const specsDir = path.join(__dirname, '..', 'specs');

/** Same rules as playwright.config.mjs `testMatch`. */
export function resolveTestMatchGlob () {
	const spec = process.env.PLAYWRIGHT_SPEC?.trim();

	if (!spec) {
		return '**/*-spec.js';
	}

	const base = spec.replace(/\.js$/, '');

	if (base.endsWith('-spec')) {
		return `**/${base}.js`;
	}

	return `**/*${base}*-spec.js`;
}

export function specFileMatchesFilter (baseName, specFilter) {
	if (!specFilter) {
		return baseName.endsWith('-spec');
	}

	const base = specFilter.replace(/\.js$/, '');

	if (base.endsWith('-spec')) {
		return baseName === base;
	}

	return baseName.includes(base) && baseName.endsWith('-spec');
}

function walkSpecFiles (dir) {
	const files = [];

	for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
		const entryPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...walkSpecFiles(entryPath));
		} else if (entry.name.endsWith('-spec.js')) {
			files.push(entryPath);
		}
	}

	return files;
}

function parseSpecMeta (content) {
	const concurrency = content.match(/concurrency:\s*(\d+)/)?.[1];
	const skin = content.match(/skin:\s*'([^']+)'/)?.[1];
	const highContrast = content.match(/highContrast:\s*(true|false)/)?.[1];

	if (!concurrency || !skin || highContrast == null) {
		return null;
	}

	return {
		concurrency: Number.parseInt(concurrency),
		skin,
		highContrast: highContrast === 'true'
	};
}

/** Shards that should run per skin/HC group for the current PLAYWRIGHT_SPEC filter. */
export function getExpectedShardsByGroup (maxWorkers) {
	const specFilter = process.env.PLAYWRIGHT_SPEC?.trim() || null;
	const groups = new Map();

	for (const filePath of walkSpecFiles(specsDir)) {
		const baseName = path.basename(filePath, '.js');

		if (!specFileMatchesFilter(baseName, specFilter)) {
			continue;
		}

		const meta = parseSpecMeta(fs.readFileSync(filePath, 'utf8'));

		if (!meta?.concurrency || meta.concurrency > maxWorkers) {
			continue;
		}

		const groupKey = `${meta.skin}-${meta.highContrast}`;

		if (!groups.has(groupKey)) {
			groups.set(groupKey, new Set());
		}

		groups.get(groupKey).add(meta.concurrency);
	}

	return groups;
}
