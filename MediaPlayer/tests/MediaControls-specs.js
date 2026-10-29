/* global HTMLElement, requestAnimationFrame */

import {addAll} from '@enact/core/keymap';
import Spotlight from '@enact/spotlight';
import '@testing-library/jest-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {createRef} from 'react';

import MediaControls from '../MediaControls';

addAll({
	play: 415,
	pause: 19,
	rewind: 412,
	fastForward: 417
});

const key = (type, keyCode, target = document) => {
	fireEvent[type](target, {keyCode});
};

describe('MediaControls', () => {
	let animations;

	beforeEach(() => {
		animations = [];
		HTMLElement.prototype.animate = function () {
			const animation = {
				cancel () {
					if (this.oncancel) {
						this.oncancel();
					}
				}
			};
			animations.push(animation);
			return animation;
		};

		jest.spyOn(Spotlight, 'getCurrent').mockReturnValue(null);
		jest.spyOn(Spotlight, 'getPointerMode').mockReturnValue(false);
		jest.spyOn(Spotlight, 'focus').mockImplementation(() => true);
	});

	afterEach(() => {
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	test('should jump while hidden and keep pulsing until the key repeats, changes, or blurs', () => {
		jest.useFakeTimers();
		const handleJump = jest.fn();

		render(
			<MediaControls id="mediaControls" visible={false} onJump={handleJump} />
		);

		key('keyDown', 37);

		expect(handleJump).toHaveBeenCalledTimes(1);
		expect(handleJump).toHaveBeenCalledWith(expect.objectContaining({keyCode: 37}));

		act(() => {
			jest.advanceTimersByTime(400);
		});

		expect(handleJump).toHaveBeenCalledTimes(2);

		key('keyDown', 37);
		key('keyDown', 39);

		expect(handleJump).toHaveBeenCalledWith(expect.objectContaining({keyCode: 39}));

		key('keyUp', 39);

		act(() => {
			jest.advanceTimersByTime(400);
		});

		const callsAfterKeyUp = handleJump.mock.calls.length;

		fireEvent.blur(window);

		act(() => {
			jest.advanceTimersByTime(400);
		});

		expect(handleJump).toHaveBeenCalledTimes(callsAfterKeyUp);
	});

	test('should not jump when 5-way jump is disabled or a control is focused', () => {
		const handleJump = jest.fn();
		const {rerender} = render(
			<MediaControls id="mediaControls" visible={false} no5WayJump onJump={handleJump} />
		);

		key('keyDown', 37);
		key('keyUp', 37);

		Spotlight.getCurrent.mockReturnValue(document.body);
		rerender(
			<MediaControls id="mediaControls" visible={false} onJump={handleJump} />
		);

		key('keyDown', 37);

		expect(handleJump).not.toHaveBeenCalled();
	});

	test('should forward playback keys', () => {
		const handleFastForward = jest.fn();
		const handlePause = jest.fn();
		const handlePlay = jest.fn();
		const handleRewind = jest.fn();

		const {rerender} = render(
			<MediaControls
				id="mediaControls"
				visible={false}
				onFastForward={handleFastForward}
				onPause={handlePause}
				onPlay={handlePlay}
				onRewind={handleRewind}
			/>
		);

		key('keyUp', 415);
		key('keyUp', 19);
		key('keyUp', 412);
		key('keyUp', 417);

		expect(handlePlay).toHaveBeenCalledTimes(1);
		expect(handlePause).toHaveBeenCalledTimes(1);
		expect(handleRewind).toHaveBeenCalledTimes(1);
		expect(handleFastForward).toHaveBeenCalledTimes(1);

		rerender(
			<MediaControls
				id="mediaControls"
				visible={false}
				mediaDisabled
				onPlay={handlePlay}
			/>
		);

		key('keyUp', 415);

		rerender(
			<MediaControls
				id="mediaControls"
				visible={false}
				no5WayJump
				playPauseButtonDisabled
				rateChangeDisabled
				onFastForward={handleFastForward}
				onPause={handlePause}
				onPlay={handlePlay}
				onRewind={handleRewind}
			/>
		);

		key('keyUp', 37);
		key('keyUp', 415);
		key('keyUp', 412);

		expect(handlePlay).toHaveBeenCalledTimes(1);
		expect(handleRewind).toHaveBeenCalledTimes(1);
	});

	test('should forward play and pause from the play button', () => {
		const handlePause = jest.fn();
		const handlePlay = jest.fn();
		const handlePlayButtonClick = jest.fn();

		const {rerender} = render(
			<MediaControls
				id="mediaControls"
				paused
				onPause={handlePause}
				onPlay={handlePlay}
				onPlayButtonClick={handlePlayButtonClick}
			/>
		);

		fireEvent.click(screen.getByRole('button', {name: 'Play'}));

		expect(handlePlayButtonClick).toHaveBeenCalledTimes(1);
		expect(handlePlay).toHaveBeenCalledTimes(1);

		rerender(
			<MediaControls
				id="mediaControls"
				onPause={handlePause}
				onPlay={handlePlay}
				onPlayButtonClick={handlePlayButtonClick}
			/>
		);

		fireEvent.click(screen.getByRole('button', {name: 'Pause'}));

		expect(handlePause).toHaveBeenCalledTimes(1);
	});

	test('should forward close when the controls are visible', () => {
		const handleClose = jest.fn();

		render(
			<MediaControls id="mediaControls" visible onClose={handleClose} />
		);

		key('keyUp', 27, window);

		expect(handleClose).toHaveBeenCalled();
	});

	test('should stop a jump when the controls are disabled or become visible', () => {
		jest.useFakeTimers();
		const handleJump = jest.fn();
		const {rerender} = render(
			<MediaControls id="mediaControls" visible={false} onJump={handleJump} />
		);

		key('keyDown', 37);

		rerender(
			<MediaControls id="mediaControls" visible={false} mediaDisabled onJump={handleJump} />
		);

		const calls = handleJump.mock.calls.length;

		act(() => {
			jest.advanceTimersByTime(400);
		});

		expect(handleJump).toHaveBeenCalledTimes(calls);

		rerender(
			<MediaControls id="mediaControls" visible onJump={handleJump} />
		);
	});

	test('should show and hide more components', async () => {
		const handleToggleMore = jest.fn();
		const mediaControls = createRef();

		const {rerender} = render(
			<MediaControls id="mediaControls" ref={mediaControls} visible onToggleMore={handleToggleMore}>
				<button>More</button>
			</MediaControls>
		);

		act(() => {
			mediaControls.current.showMoreComponents();
			mediaControls.current.hideMoreComponents();
		});

		expect(mediaControls.current.areMoreComponentsAvailable()).toBe(false);

		act(() => {
			mediaControls.current.showMoreComponents();
		});

		await act(async () => {
			await new Promise((resolve) => requestAnimationFrame(resolve));
		});

		expect(handleToggleMore).toHaveBeenCalledWith(expect.objectContaining({
			type: 'onToggleMore',
			showMoreComponents: true
		}));
		expect(animations.length).toBeGreaterThan(0);

		const animation = animations[animations.length - 1];
		animation.onfinish();

		expect(Spotlight.focus).toHaveBeenCalled();

		act(() => {
			mediaControls.current.hideMoreComponents();
		});

		expect(handleToggleMore).toHaveBeenCalledWith(expect.objectContaining({
			showMoreComponents: false
		}));

		animation.onfinish();

		rerender(
			<MediaControls id="mediaControls" ref={mediaControls} visible={false} onToggleMore={handleToggleMore}>
				<button>More</button>
			</MediaControls>
		);

		act(() => {
			mediaControls.current.showMoreComponents();
		});

		expect(mediaControls.current.areMoreComponentsAvailable()).toBe(false);
	});
});
