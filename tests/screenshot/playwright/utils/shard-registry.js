import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {getExpectedShardsByGroup} from './spec-match.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registryPath = path.join(__dirname, '..', '.shard-registry.jsonl');

export function clearShardRegistry () {
	if (fs.existsSync(registryPath)) {
		fs.unlinkSync(registryPath);
	}
}

export function recordShard ({skin, highContrast, concurrency}, maxWorkers) {
	if (process.env.PLAYWRIGHT_COMPONENT || !concurrency) {
		return;
	}

	const entry = JSON.stringify({
		groupKey: `${skin}-${highContrast}`,
		concurrency,
		maxWorkers
	});

	fs.appendFileSync(registryPath, `${entry}\n`);
}

export function validateShardCoverage () {
	if (process.env.PLAYWRIGHT_COMPONENT || !fs.existsSync(registryPath)) {
		return;
	}

	const actualGroups = new Map();

	for (const line of fs.readFileSync(registryPath, 'utf8').split('\n')) {
		if (!line.trim()) {
			continue;
		}

		const {groupKey, concurrency, maxWorkers: recordedMaxWorkers} = JSON.parse(line);

		if (!actualGroups.has(groupKey)) {
			actualGroups.set(groupKey, {maxWorkers: recordedMaxWorkers, shards: new Set()});
		}

		const group = actualGroups.get(groupKey);
		group.maxWorkers = recordedMaxWorkers;
		group.shards.add(concurrency);
	}

	const maxWorkers = process.env.PLAYWRIGHT_INSTANCES ?
		Number.parseInt(process.env.PLAYWRIGHT_INSTANCES) :
		[...actualGroups.values()][0]?.maxWorkers ?? 5;
	const expectedGroups = getExpectedShardsByGroup(maxWorkers);
	const groupKeys = new Set([...expectedGroups.keys(), ...actualGroups.keys()]);
	const specHint = process.env.PLAYWRIGHT_SPEC?.trim() ?
		`PLAYWRIGHT_SPEC=${process.env.PLAYWRIGHT_SPEC.trim()}` :
		'all *-spec.js files';

	for (const groupKey of groupKeys) {
		const required = [...(expectedGroups.get(groupKey) || [])].sort((a, b) => a - b);
		const covering = [...(actualGroups.get(groupKey)?.shards || [])]
			.filter(shard => shard <= maxWorkers)
			.sort((a, b) => a - b);
		const missing = required.filter(shard => !covering.includes(shard));

		if (missing.length > 0) {
			throw new Error(
				`Incomplete Playwright shard coverage for ${groupKey}: ` +
				`${specHint} requires shards ${required.join(', ')}, ` +
				`but only ${covering.length ? covering.join(', ') : '(none)'} ran. ` +
				`Missing: ${missing.join(', ')}.`
			);
		}
	}
}
