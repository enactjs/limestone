import {getViewMotion, getViewMotionDistance, parseTransition, splitOutsideParens} from '../motion';

describe('motion', () => {
	describe('splitOutsideParens', () => {
		test('should not split inside parentheses', () => {
			const expected = ['transform 470ms 30ms cubic-bezier(0.1, 0.6, 0.15, 1)', 'opacity 380ms'];
			const actual = splitOutsideParens('transform 470ms 30ms cubic-bezier(0.1, 0.6, 0.15, 1), opacity 380ms', /,/);

			expect(actual).toEqual(expected);
		});
	});

	describe('parseTransition', () => {
		test('should parse the duration, delay and easing of each property', () => {
			const expected = [
				{property: 'transform', duration: 470, delay: 30, easing: 'cubic-bezier(0.1, 0.6, 0.15, 1)'},
				{property: 'opacity', duration: 380, delay: 120, easing: 'cubic-bezier(0.1, 0.6, 0.15, 1)'}
			];
			const actual = parseTransition('transform 470ms 30ms cubic-bezier(0.1, 0.6, 0.15, 1), opacity 0.38s 120ms cubic-bezier(0.1, 0.6, 0.15, 1)');

			expect(actual).toEqual(expected);
		});

		test('should default the delay to 0 and the easing to `ease`', () => {
			const expected = [{property: 'opacity', duration: 250, delay: 0, easing: 'ease'}];
			const actual = parseTransition('opacity 250ms');

			expect(actual).toEqual(expected);
		});

		test('should return an empty array for an empty value', () => {
			expect(parseTransition('')).toEqual([]);
		});
	});

	describe('getViewMotion', () => {
		const createNode = (properties = {}) => {
			const node = document.createElement('div');
			Object.keys(properties).forEach((name) => node.style.setProperty(name, properties[name]));
			document.body.appendChild(node);

			return node;
		};

		afterEach(() => {
			document.body.innerHTML = '';
		});

		test('should return `null` when no node is given', () => {
			expect(getViewMotion(null, 'enter')).toBeNull();
		});

		test('should return `null` when the motion is not set', () => {
			const node = createNode();

			expect(getViewMotion(node, 'enter')).toBeNull();
		});

		test('should read the motion of the requested type', () => {
			const node = createNode({
				'--lime-view-enter-motion': 'transform 470ms 30ms ease-out',
				'--lime-view-exit-motion': 'transform 500ms 0ms ease-in-out'
			});

			expect(getViewMotion(node, 'enter')).toEqual([{property: 'transform', duration: 470, delay: 30, easing: 'ease-out'}]);
			expect(getViewMotion(node, 'exit')).toEqual([{property: 'transform', duration: 500, delay: 0, easing: 'ease-in-out'}]);
		});
	});

	describe('getViewMotionDistance', () => {
		afterEach(() => {
			document.body.innerHTML = '';
		});

		test('should return `null` when no node is given', () => {
			expect(getViewMotionDistance(null)).toBeNull();
		});

		test('should return `null` when the distance is not set', () => {
			const node = document.createElement('div');
			document.body.appendChild(node);

			expect(getViewMotionDistance(node)).toBeNull();
		});

		test('should read the distance', () => {
			const node = document.createElement('div');
			node.style.setProperty('--lime-view-motion-distance', '25rem');
			document.body.appendChild(node);

			expect(getViewMotionDistance(node)).toBe('25rem');
		});
	});
});
