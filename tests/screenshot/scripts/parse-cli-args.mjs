const PLAYWRIGHT_VALUE_FLAGS = new Set(['--component', '--spec', '--parallel', '--test-id', '--title']);
const COMPONENT_VALUE_FLAGS = new Set(['--test-id', '--title', '--parallel', '--spec']);

/**
 * Value flags consume all following tokens until the next --flag (multi-word values).
 */
function parseCliArgs (argv = process.argv, {valueFlags, captureFirstPositional = false} = {}) {
	const args = argv.slice(2).filter(a => a !== '--');
	const flags = new Set();
	const values = {};
	let positional = null;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (!arg.startsWith('--')) {
			if (captureFirstPositional && !positional) {
				positional = arg;
			}
			continue;
		}

		if (valueFlags.has(arg)) {
			const valueParts = [];
			while (++i < args.length && !args[i].startsWith('--')) {
				valueParts.push(args[i]);
			}
			values[arg] = valueParts.length > 0 ? valueParts.join(' ') : null;
			i--;
			continue;
		}

		flags.add(arg);
	}

	return {flags, values, positional};
}

/** True when argv has a positional component name (test-playwright:component). */
export function isComponentPlaywrightRun (argv = process.argv) {
	const args = argv.slice(2).filter(a => a !== '--');

	if (args.includes('--component')) {
		return false;
	}

	return parseComponentArgs(argv).component != null;
}

/**
 * Parse CLI args for npm run test-playwright.
 * All flags are optional; default run executes all specs on all components.
 */
export function parsePlaywrightArgs (argv = process.argv) {
	const {flags, values} = parseCliArgs(argv, {valueFlags: PLAYWRIGHT_VALUE_FLAGS});

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

/**
 * Parse component CLI args without treating flag values as the component name.
 * Component name must be the first positional token (flags may follow).
 */
export function parseComponentArgs (argv = process.argv) {
	const {flags, values, positional} = parseCliArgs(argv, {
		valueFlags: COMPONENT_VALUE_FLAGS,
		captureFirstPositional: true
	});

	return {
		component: positional,
		update: flags.has('--update'),
		// --build is used by benchmark.mjs only; Playwright runners use --skip-build instead.
		withBuild: flags.has('--build'),
		skipBuild: flags.has('--skip-build'),
		testId: values['--test-id'],
		title: values['--title'],
		spec: values['--spec'],
		parallel: Math.max(1, Number.parseInt(values['--parallel'] ?? '1') || 1)
	};
}
