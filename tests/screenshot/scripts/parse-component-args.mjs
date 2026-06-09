const VALUE_FLAGS = new Set(['--test-id', '--title', '--parallel']);

/**
 * Parse component CLI args without treating flag values as the component name.
 * Component name must be the first positional token (flags may follow).
 */
export function parseComponentArgs (argv = process.argv) {
	const args = argv.slice(2).filter(a => a !== '--');
	const flags = new Set();
	const values = {};
	let component = null;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (!arg.startsWith('--')) {
			if (!component) {
				component = arg;
			}
			continue;
		}

		if (VALUE_FLAGS.has(arg)) {
			values[arg] = args[i + 1] ?? null;
			i++;
			continue;
		}

		flags.add(arg);
	}

	return {
		component,
		update: flags.has('--update'),
		withBuild: flags.has('--build'),
		skipBuild: flags.has('--skip-build'),
		testId: values['--test-id'],
		title: values['--title'],
		parallel: Math.max(1, Number.parseInt(values['--parallel'] ?? '1') || 1)
	};
}
