import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const stylesDir = path.join(repoRoot, 'styles');

const readStyleFile = (filename) => fs.readFileSync(path.join(stylesDir, filename), 'utf8');

const readRepoFile = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const getDeclaration = (source, name) => {
	const pattern = new RegExp(`${name}:\\s*([^;\\n]+);`);
	const match = source.match(pattern);

	return match ? match[1].trim() : null;
};

const getMixinBlock = (source, mixinName) => {
	const pattern = new RegExp(`\\.${mixinName}\\(\\)\\s*\\{([\\s\\S]*?)\\n\\}`);
	const match = source.match(pattern);

	return match ? match[1] : null;
};

describe('press/release motion tokens', () => {
	const motions = readStyleFile('motions.less');
	const variables = readStyleFile('variables.less');
	const motionMixins = readStyleFile('motion-mixins.less');

	describe('motions.less', () => {
		test('should define press and release durations from the motion guide', () => {
			expect(getDeclaration(motions, '--lime-motion-medium1-duration')).toBe('250ms');
			expect(getDeclaration(motions, '--lime-motion-medium2-duration')).toBe('300ms');
			expect(getDeclaration(motions, '--lime-press-motion-duration')).toBe('var(--lime-motion-medium1-duration)');
			expect(getDeclaration(motions, '--lime-release-motion-duration')).toBe('var(--lime-motion-medium2-duration)');
		});

		test('should define press easing as EO and release easing as EIO', () => {
			expect(getDeclaration(motions, '--lime-press-motion-easing-function')).toBe('var(--lime-EO-motion-easing-function)');
			expect(getDeclaration(motions, '--lime-release-motion-easing-function')).toBe('var(--lime-EIO-motion-easing-function)');
		});
	});

	describe('variables.less', () => {
		test('should define thumbnail and card press/release scale values', () => {
			expect(getDeclaration(variables, '@lime-focusexpand-focus-transform')).toBe('scale(1.1)');
			expect(getDeclaration(variables, '@lime-focusexpand-pressed-transform')).toBe('scale(1.05)');
		});

		test('should define slider press/release scale values', () => {
			expect(getDeclaration(variables, '@lime-slider-focus-scale')).toBe('1.33');
			expect(getDeclaration(variables, '@lime-slider-focusin-transform')).toBe('scale(@lime-slider-focus-scale)');
			expect(getDeclaration(variables, '@lime-slider-press-transform')).toBe('scale(1.16)');
			expect(getDeclaration(variables, '@lime-slider-release-transform')).toBe('@lime-slider-focusin-transform');
			expect(getDeclaration(variables, '@lime-slider-tooltip-offset-focused')).toBe('(@lime-slider-knob-width * @lime-slider-focus-scale / 2)');
		});

		test('should define icon item press/release scale values', () => {
			expect(getDeclaration(variables, '@lime-iconitem-focus-transform')).toBe('scale(1.2)');
			expect(getDeclaration(variables, '@lime-iconitem-pressed-transform')).toBe('scale(1.1)');
		});
	});

	describe('motion-mixins.less', () => {
		test('should wire shared press and release mixins to focusexpand transforms', () => {
			const pressMixin = getMixinBlock(motionMixins, 'lime-press-motion');
			const releaseMixin = getMixinBlock(motionMixins, 'lime-release-motion');

			expect(pressMixin).toContain('transform: @lime-focusexpand-pressed-transform;');
			expect(pressMixin).toContain('transition: transform var(--lime-press-motion-duration) var(--lime-press-motion-easing-function);');
			expect(releaseMixin).toContain('transform: @lime-focusexpand-focus-transform;');
			expect(releaseMixin).toContain('transition: transform var(--lime-release-motion-duration) var(--lime-release-motion-easing-function);');
		});

		test('should wire slider press and release mixins to slider transforms', () => {
			const pressMixin = getMixinBlock(motionMixins, 'lime-slider-press-motion');
			const releaseMixin = getMixinBlock(motionMixins, 'lime-slider-release-motion');

			expect(pressMixin).toContain('transform: @lime-translate-center @lime-slider-press-transform;');
			expect(releaseMixin).toContain('transform: @lime-translate-center @lime-slider-release-transform;');
		});

		test('should wire icon item mixins to dedicated icon item transforms', () => {
			const focusMixin = getMixinBlock(motionMixins, 'lime-iconitem-focus-in-motion');
			const pressMixin = getMixinBlock(motionMixins, 'lime-iconitem-press-motion');
			const releaseMixin = getMixinBlock(motionMixins, 'lime-iconitem-release-motion');

			expect(focusMixin).toContain('transform: @lime-iconitem-focus-transform;');
			expect(pressMixin).toContain('transform: @lime-iconitem-pressed-transform;');
			expect(releaseMixin).toContain('transform: @lime-iconitem-focus-transform;');
		});
	});

	describe('IconItem.module.less', () => {
		const iconItemStyles = readRepoFile('IconItem/IconItem.module.less');

		test('should use dedicated icon item motion mixins and pressed class selector', () => {
			expect(iconItemStyles).toContain('.lime-iconitem-focus-in-motion();');
			expect(iconItemStyles).toContain('.lime-iconitem-press-motion();');
			expect(iconItemStyles).toContain('.lime-iconitem-release-motion();');
			expect(iconItemStyles).toContain('&:not(.pressed)');
			expect(iconItemStyles).not.toContain('&:not(:pressed)');
		});
	});
});
