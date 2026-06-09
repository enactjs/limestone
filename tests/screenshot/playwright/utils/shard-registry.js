import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

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

	const groups = new Map();

	for (const line of fs.readFileSync(registryPath, 'utf8').split('\n')) {
		if (!line.trim()) {
			continue;
		}

		const {groupKey, concurrency, maxWorkers} = JSON.parse(line);

		if (!groups.has(groupKey)) {
			groups.set(groupKey, {maxWorkers, shards: new Set()});
		}

		const group = groups.get(groupKey);
		group.maxWorkers = maxWorkers;
		group.shards.add(concurrency);
	}

	for (const [groupKey, {maxWorkers, shards}] of groups) {
		const covering = [...shards].filter(shard => shard <= maxWorkers).sort((a, b) => a - b);
		const required = [...Array(maxWorkers)].map((_, index) => index + 1);
		const missing = required.filter(shard => !covering.includes(shard));

		if (covering.length > 1 && missing.length > 0) {
			throw new Error(
				`Incomplete Playwright shard coverage for ${groupKey}: ` +
				`PLAYWRIGHT_INSTANCES=${maxWorkers} requires shards ${required.join(', ')}, ` +
				`but only ${covering.join(', ')} ran. ` +
				`Cases with testId % ${maxWorkers} in {${missing.map(shard => shard - 1).join(', ')}} were never tested.`
			);
		}
	}
}
