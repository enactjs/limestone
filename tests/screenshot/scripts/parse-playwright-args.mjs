const VALUE_FLAGS = new Set(['--component', '--spec', '--parallel', '--test-id', '--title']);

/**
 * Parse CLI args for npm run test-playwright.
 * All flags are optional; default run executes all specs on all components.
 */
export function parsePlaywrightArgs (argv = process.argv) {
	const args = argv.slice(2).filter(a => a !== '--');
	const flags = new Set();
	const values = {};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (!arg.startsWith('--')) {
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
		component: values['--component'] ?? null,
		spec: values['--spec'] ?? null,
		update: flags.has('--update'),
		skipBuild: flags.has('--skip-build'),
		testId: values['--test-id'],
		title: values['--title'],
		parallel: values['--parallel'] != null ?
			Math.max(1, Number.parseInt(values['--parallel']) || 1) :
			null
	};
}
