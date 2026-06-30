import {validateShardCoverage} from './utils/shard-registry.js';

export default async function globalTeardown () {
	validateShardCoverage();
}
