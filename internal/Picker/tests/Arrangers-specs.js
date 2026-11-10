import {CarouselArranger, FastHorizontalCarouselArranger, FastVerticalCarouselArranger} from '../Arrangers';

const EO = 'cubic-bezier(0.1, 0.6, 0.15, 1)';
const EIO = 'cubic-bezier(0.2, 0, 0.05, 1)';

const enterMotion = `transform 470ms 30ms ${EO}, opacity 380ms 120ms ${EO}`;
const exitMotion = `transform 500ms 0ms ${EIO}, opacity 250ms 0ms ${EIO}`;

const createMockAnimation = () => ({
	playState: 'running',
	onfinish: null,
	finish: jest.fn(function () {
		this.playState = 'finished';
	}),
	cancel: jest.fn(),
	reverse: jest.fn()
});

// Creates an element so the arranger can read the motion set with `.lime-view-motions()`
const createNode = (motions = {}) => {
	const node = document.createElement('div');

	if (motions.enter) node.style.setProperty('--lime-view-enter-motion', motions.enter);
	if (motions.exit) node.style.setProperty('--lime-view-exit-motion', motions.exit);
	if (motions.distance) node.style.setProperty('--lime-view-motion-distance', motions.distance);

	node.animate = jest.fn(() => createMockAnimation());
	document.body.appendChild(node);

	return node;
};

// Returns the keyframes and options of the position and opacity animations
const getAnimations = (node) => {
	const [position, opacity] = node.animate.mock.calls;

	return {
		position: {keyframes: position[0], options: position[1]},
		opacity: {keyframes: opacity[0], options: opacity[1]}
	};
};

describe('Picker Arrangers Specs', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	describe('without view motions', () => {
		test('should slide and fade in the entering view with the default enter timing', () => {
			const node = createNode();

			FastHorizontalCarouselArranger.enter({node, reverse: false});

			const {position, opacity} = getAnimations(node);

			expect(position.keyframes).toEqual([{transform: 'translateX(270px)'}, {transform: 'translateX(0)'}]);
			expect(position.options).toMatchObject({duration: 470, delay: 30, easing: 'ease-out'});
			expect(opacity.keyframes).toEqual([{opacity: 0}, {opacity: 1}]);
			expect(opacity.options).toMatchObject({duration: 380, delay: 120, easing: 'ease-out'});
		});

		test('should slide and fade out the leaving view with the default exit timing', () => {
			const node = createNode();

			FastHorizontalCarouselArranger.leave({node, reverse: false});

			const {position, opacity} = getAnimations(node);

			expect(position.keyframes).toEqual([{transform: 'translateX(-270px)'}]);
			expect(position.options).toMatchObject({duration: 500, delay: 0, easing: 'ease-in-out'});
			expect(opacity.keyframes).toEqual([{opacity: 0}]);
			expect(opacity.options).toMatchObject({duration: 250, delay: 0, easing: 'ease-in-out'});
		});
	});

	describe('with view motions', () => {
		test('should use the enter motion for the entering view', () => {
			const node = createNode({enter: enterMotion, exit: exitMotion});

			FastHorizontalCarouselArranger.enter({node, reverse: false});

			const {position, opacity} = getAnimations(node);

			expect(position.options).toMatchObject({duration: 470, delay: 30, easing: EO});
			expect(opacity.options).toMatchObject({duration: 380, delay: 120, easing: EO});
		});

		test('should use the exit motion for the leaving view', () => {
			const node = createNode({enter: enterMotion, exit: exitMotion});

			FastHorizontalCarouselArranger.leave({node, reverse: false});

			const {position, opacity} = getAnimations(node);

			expect(position.options).toMatchObject({duration: 500, delay: 0, easing: EIO});
			expect(opacity.options).toMatchObject({duration: 250, delay: 0, easing: EIO});
		});

		test('should use the enter motion for the entering view when reversed', () => {
			const node = createNode({enter: enterMotion, exit: exitMotion});

			// ViewManager calls `leave` for the entering view when `reverse` is set
			FastHorizontalCarouselArranger.leave({node, reverse: true});

			const {position, opacity} = getAnimations(node);

			expect(position.keyframes).toEqual([{transform: 'translateX(-270px)'}, {transform: 'translateX(0)'}]);
			expect(position.options).toMatchObject({duration: 470, delay: 30, easing: EO});
			expect(opacity.options).toMatchObject({duration: 380, delay: 120, easing: EO});
		});

		test('should use the exit motion for the leaving view when reversed', () => {
			const node = createNode({enter: enterMotion, exit: exitMotion});

			// ViewManager calls `enter` for the leaving view when `reverse` is set
			FastHorizontalCarouselArranger.enter({node, reverse: true});

			const {position, opacity} = getAnimations(node);

			expect(position.keyframes).toEqual([{transform: 'translateX(270px)'}]);
			expect(position.options).toMatchObject({duration: 500, delay: 0, easing: EIO});
			expect(opacity.options).toMatchObject({duration: 250, delay: 0, easing: EIO});
		});

		test('should use the default timing of the properties without a transition', () => {
			const node = createNode({enter: `transform 600ms 10ms ${EO}`});

			FastHorizontalCarouselArranger.enter({node, reverse: false});

			const {position, opacity} = getAnimations(node);

			expect(position.options).toMatchObject({duration: 600, delay: 10, easing: EO});
			expect(opacity.options).toMatchObject({duration: 380, delay: 120, easing: 'ease-out'});
		});

		test('should keep the translation distance of the arranger when no distance is set', () => {
			const node = createNode({enter: enterMotion});

			FastVerticalCarouselArranger.enter({node, reverse: false});

			const {position} = getAnimations(node);

			expect(position.keyframes).toEqual([{transform: 'translateY(-165px)'}, {transform: 'translateY(0)'}]);
		});

		test('should translate the entering view by the distance set in the styles', () => {
			const node = createNode({enter: enterMotion, distance: ' 5.625rem'});

			FastHorizontalCarouselArranger.enter({node, reverse: false});

			const {position} = getAnimations(node);

			expect(position.keyframes).toEqual([{transform: 'translateX(5.625rem)'}, {transform: 'translateX(0)'}]);
		});

		test('should translate the leaving view by the distance set in the styles', () => {
			const node = createNode({exit: exitMotion, distance: '3.4375rem'});

			FastVerticalCarouselArranger.leave({node, reverse: false});

			const {position} = getAnimations(node);

			expect(position.keyframes).toEqual([{transform: 'translateY(3.4375rem)'}]);
		});

		test('should translate the reversed views by the distance set in the styles', () => {
			const entering = createNode({enter: enterMotion, distance: '5.625rem'});
			const leaving = createNode({exit: exitMotion, distance: '5.625rem'});

			FastHorizontalCarouselArranger.leave({node: entering, reverse: true});
			FastHorizontalCarouselArranger.enter({node: leaving, reverse: true});

			expect(getAnimations(entering).position.keyframes).toEqual([{transform: 'translateX(-5.625rem)'}, {transform: 'translateX(0)'}]);
			expect(getAnimations(leaving).position.keyframes).toEqual([{transform: 'translateX(5.625rem)'}]);
		});

		test('should let `optionsEnter` override the enter motion', () => {
			const node = createNode({enter: enterMotion});
			const arranger = CarouselArranger({optionsEnter: {positionDuration: 100}});

			arranger.enter({node, reverse: false});

			const {position} = getAnimations(node);

			expect(position.options).toMatchObject({duration: 100, delay: 30, easing: EO});
		});
	});

	describe('combined animation', () => {
		test('should use the animation ending last as the primary animation', () => {
			// opacity ends at 700ms, after the position at 500ms
			const node = createNode({enter: `transform 470ms 30ms ${EO}, opacity 500ms 200ms ${EO}`});

			const animation = FastHorizontalCarouselArranger.enter({node, reverse: false});
			const [position, opacity] = node.animate.mock.results.map(({value}) => value);
			const handler = jest.fn();

			animation.onfinish = handler;
			opacity.onfinish();

			expect(handler).toHaveBeenCalled();
			expect(position.finish).toHaveBeenCalled();
		});

		test('should finish, cancel and reverse both animations', () => {
			const node = createNode();

			const animation = FastHorizontalCarouselArranger.enter({node, reverse: false});
			const [position, opacity] = node.animate.mock.results.map(({value}) => value);

			animation.finish();
			animation.cancel();
			animation.reverse();

			[position, opacity].forEach((anim) => {
				expect(anim.finish).toHaveBeenCalled();
				expect(anim.cancel).toHaveBeenCalled();
				expect(anim.reverse).toHaveBeenCalled();
			});
		});
	});

	describe('stay', () => {
		test('should keep the view in place and visible', () => {
			const node = createNode({enter: enterMotion});

			FastHorizontalCarouselArranger.stay({node});

			const {position, opacity} = getAnimations(node);

			expect(position.keyframes).toEqual([{transform: 'translateX(0)'}, {transform: 'translateX(0)'}]);
			expect(opacity.keyframes).toEqual([{opacity: 1}, {opacity: 1}]);
		});
	});
});
