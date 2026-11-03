/* global HTMLMediaElement */

import '@testing-library/jest-dom';
import {act, createEvent, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createRef} from 'react';

import {Spotlight} from '@enact/spotlight';

import VideoPlayer, {VideoPlayerBase} from '../VideoPlayer';
import {Button} from '../../Button';
import {MediaControls} from '../../MediaPlayer';

const focus = (slider) => fireEvent.focus(slider);

const keyDown = (keyCode) => (elm) => fireEvent.keyDown(elm, {keyCode});
const downKeyDown = keyDown(40);

// jsdom does not load media, so fake a video that has loaded enough to play and notify the player
const loadVideo = (video) => {
	Object.defineProperties(video, {
		currentTime: {value: 50, writable: true},
		duration: {value: 100, writable: true},
		playbackRate: {value: 1, writable: true},
		readyState: {value: 4, writable: true}
	});

	fireEvent(video, new Event('durationchange'));
};

describe('VideoPlayer', () => {
	test('should fire `onPlaying` with `playing` type when playing event is fired', () => {
		const handlePlaying = jest.fn();

		render(
			<VideoPlayer data-testid="videoplayer-id" onPlaying={handlePlaying} />
		);

		const video = screen.getByTestId('videoplayer-id');

		const playingEvent = createEvent('playing', video);
		fireEvent(video, playingEvent);

		const expected = {type: 'playing'};
		const actual = handlePlaying.mock.calls.length && handlePlaying.mock.calls[0][0];

		expect(actual).toMatchObject(expected);
	});

	test('should fire `onControlsAvailable` with `onControlsAvailable` type when screen clicked', () => {
		const handleControlsAvailable = jest.fn();

		render(
			<VideoPlayer data-testid="videoplayer-id" onControlsAvailable={handleControlsAvailable} />
		);

		const overlay = screen.getByTestId('videoplayer-id').nextElementSibling;
		downKeyDown(overlay);

		const slider = screen.getByRole('slider', {hidden: true});
		focus(slider); // add to increase code coverage

		const expected = {type: 'onControlsAvailable'};
		const actual = handleControlsAvailable.mock.calls.length && handleControlsAvailable.mock.calls[0][0];

		expect(actual).toMatchObject(expected);
	});

	test('should not to show media slider when noslider is true', async () => {
		const user = userEvent.setup();
		render(
			<VideoPlayer data-testid="videoplayer-id" noSlider />
		);

		const overlay = screen.getByTestId('videoplayer-id').nextElementSibling;
		await user.click(overlay);

		await screen.findByLabelText('go to previous');

		const slider = screen.queryByRole('slider', {hidden: true});
		expect(slider).toBeNull();
	});

	test('should fire `onBack` with `onBack` type when clicking on back button', async () => {
		const handleBack = jest.fn();
		const user = userEvent.setup();

		render(
			<VideoPlayer data-testid="videoplayer-id" onBack={handleBack} />
		);

		const overlay = screen.getByTestId('videoplayer-id').nextElementSibling;
		await user.click(overlay);

		const expected = {type: 'onBack'};

		await screen.findByLabelText('go to previous');

		await user.click(screen.getByLabelText('go to previous'));

		const actual = handleBack.mock.calls.length && handleBack.mock.calls[0][0];
		expect(actual).toMatchObject(expected);
	});

	test('should toggle to show the media control', async () => {
		const user = userEvent.setup();
		render(
			<VideoPlayer data-testid="videoplayer-id" />
		);

		const overlay = screen.getByTestId('videoplayer-id').nextElementSibling;
		await user.click(overlay);

		await screen.findByLabelText('go to previous');
		await user.click(overlay);

		const backButton  = screen.queryByLabelText('go to previous');
		expect(backButton).toBeNull();
	});

	test('should not to show the media control when disable is true', async () => {
		const user = userEvent.setup();
		render(
			<VideoPlayer data-testid="videoplayer-id" disabled />
		);

		const overlay = screen.getByTestId('videoplayer-id').nextElementSibling;
		await user.click(overlay);

		const backButton  = screen.queryByLabelText('go to previous');
		expect(backButton).toBeNull();
	});

	test('should fire `onToggleMore` with `onToggleMore` type when ActionGide button clicked', async () => {
		const handleToggleMore = jest.fn();
		const user = userEvent.setup();

		render(
			<VideoPlayer data-testid="videoplayer-id" onToggleMore={handleToggleMore}>
				<MediaControls
					actionGuideButtonAriaLabel="This is ActionGide button"
				>
					<Button size="small" icon="list" />
				</MediaControls>
			</VideoPlayer>
		);

		const overlay = screen.getByTestId('videoplayer-id').nextElementSibling;

		await user.click(overlay);

		await screen.findByLabelText('go to previous');

		const actionGuideButton = screen.getByLabelText('This is ActionGide button');
		const expected = {type: 'onToggleMore'};

		await user.click(actionGuideButton);

		await waitFor(() => {
			const actual = handleToggleMore.mock.calls.length && handleToggleMore.mock.calls[0][0];
			expect(actual).toMatchObject(expected);
		});
	});

	test('should not to show the media control after the delay', async () => {
		jest.useFakeTimers();
		const timeout = 100;
		const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
		render(
			<VideoPlayer data-testid="videoplayer-id" autoCloseTimeout={timeout} />
		);

		const overlay = screen.getByTestId('videoplayer-id').nextElementSibling;
		await user.click(overlay);

		act(() => jest.advanceTimersByTime(250));

		const backButton  = screen.queryByLabelText('go to previous');
		expect(backButton).toBeNull();

		jest.useRealTimers();
	});

	test('should not to show the title after the delay', async () => {
		jest.useFakeTimers();
		const timeout = 100;
		const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
		render(
			<VideoPlayer data-testid="videoplayer-id" title="Video Test" titleHideDelay={timeout} />
		);

		const overlay = screen.getByTestId('videoplayer-id').nextElementSibling;
		await user.click(overlay);

		const titleFrame = screen.getByText('Video Test').parentElement.parentElement.parentElement;

		expect(titleFrame).toHaveClass('visible');

		act(() => jest.advanceTimersByTime(250));

		expect(titleFrame).toHaveClass('hidden');

		jest.useRealTimers();
	});
});

describe('VideoPlayerBase', () => {
	test('should expose the API methods through a ref passed directly to it', () => {
		const ref = createRef();

		render(
			<VideoPlayerBase data-testid="videoplayer-id" ref={ref} />
		);

		expect(ref.current).toEqual(expect.objectContaining({
			areControlsVisible: expect.any(Function),
			getMediaState: expect.any(Function),
			hideControls: expect.any(Function),
			pause: expect.any(Function),
			play: expect.any(Function),
			seek: expect.any(Function),
			showControls: expect.any(Function)
		}));
		expect(ref.current).not.toBeInstanceOf(window.HTMLElement);
		expect(ref.current.getMediaState()).toHaveProperty('paused');
	});

	test('should control the player through the ref without replacing the video ref', () => {
		const ref = createRef();

		render(
			<VideoPlayerBase data-testid="videoplayer-id" ref={ref} />
		);

		// the `ref` must not replace the one used for the video
		expect(screen.getByTestId('videoplayer-id').tagName).toBe('VIDEO');

		expect(ref.current.areControlsVisible()).toBe(false);
		expect(ref.current.getMediaState()).toMatchObject({currentTime: 0, playbackRate: 1});
		expect(ref.current.getVideoNode().paused).toBe(true);

		act(() => ref.current.showControls());

		expect(ref.current.areControlsVisible()).toBe(true);
	});
});

describe('VideoPlayer playback', () => {
	let pauseSpy;
	let playSpy;

	beforeEach(() => {
		jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
		pauseSpy = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
		playSpy = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test('should not change the playback rate while the source is unavailable', () => {
		const ref = createRef();

		render(
			<VideoPlayer data-testid="videoplayer-id" ref={ref} />
		);

		let result;
		act(() => {
			result = ref.current.fastForward();
		});

		expect(result).toBe(false);
		expect(screen.getByTestId('videoplayer-id').playbackRate).toBe(1);
	});

	test('should step through the slow forward and then the fast forward rates when paused', () => {
		const ref = createRef();

		render(
			<VideoPlayer data-testid="videoplayer-id" noAutoPlay ref={ref} />
		);

		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		const rates = [];
		for (let i = 0; i < 5; i++) {
			act(() => ref.current.fastForward());
			rates.push(video.playbackRate);
		}

		// `slowForward` is ['1/4', '1/2'], then `fastForward` is ['2', '4', '8', '16']
		expect(rates).toEqual([0.25, 0.5, 2, 4, 8]);
		// fast forwarding from pause resumes playback
		expect(playSpy).toHaveBeenCalled();
	});

	test('should wrap around to the first fast forward rate after the last one', () => {
		const ref = createRef();

		render(
			<VideoPlayer data-testid="videoplayer-id" ref={ref} />
		);

		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		const rates = [];
		for (let i = 0; i < 5; i++) {
			act(() => ref.current.fastForward());
			rates.push(video.playbackRate);
		}

		expect(rates).toEqual([2, 4, 8, 16, 2]);
	});

	test('should reset the playback rate when pausing or playing during fast forward', () => {
		const ref = createRef();

		render(
			<VideoPlayer data-testid="videoplayer-id" ref={ref} />
		);

		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		act(() => ref.current.fastForward());
		act(() => ref.current.fastForward());
		expect(video.playbackRate).toBe(4);

		act(() => ref.current.pause());
		expect(video.playbackRate).toBe(1);
		expect(pauseSpy).toHaveBeenCalled();

		act(() => ref.current.fastForward());
		act(() => ref.current.play());
		expect(video.playbackRate).toBe(1);
	});

	test('should rewind by pausing the video outside of webOS', () => {
		jest.useFakeTimers();
		const ref = createRef();

		const {unmount} = render(
			<VideoPlayer data-testid="videoplayer-id" ref={ref} />
		);

		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		act(() => ref.current.rewind());
		act(() => ref.current.rewind());

		// browsers do not support negative rates, so the video is paused and rewound by seeking
		expect(video.playbackRate).toBe(0);
		expect(pauseSpy).toHaveBeenCalled();

		act(() => jest.advanceTimersByTime(250));
		expect(video.currentTime).toBeLessThan(50);

		act(() => ref.current.play());
		expect(video.playbackRate).toBe(1);

		unmount();
		jest.useRealTimers();
	});

	test('should not rewind when the video is at the beginning', () => {
		const ref = createRef();

		render(
			<VideoPlayer data-testid="videoplayer-id" ref={ref} />
		);

		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);
		video.currentTime = 0;

		act(() => ref.current.rewind());

		expect(video.playbackRate).toBe(1);
	});
});

describe('VideoPlayer controls', () => {
	beforeEach(() => {
		jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test('should move focus to the hidden control handle when the media controls hide', () => {
		const ref = createRef();
		const handleControlsAvailable = jest.fn();
		const focusSpy = jest.spyOn(Spotlight, 'focus');

		render(
			<VideoPlayer onControlsAvailable={handleControlsAvailable} ref={ref} />
		);

		act(() => ref.current.showControls());
		expect(handleControlsAvailable).toHaveBeenCalledTimes(1);

		focusSpy.mockClear();
		act(() => ref.current.hideControls());

		expect(ref.current.areControlsVisible()).toBe(false);
		expect(handleControlsAvailable).toHaveBeenCalledTimes(2);
		expect(focusSpy).toHaveBeenCalledWith('.controlsHandleAbove');
	});

	test('should not move focus when the media controls hide and spotlight is disabled', () => {
		const ref = createRef();
		const focusSpy = jest.spyOn(Spotlight, 'focus');

		render(
			<VideoPlayer ref={ref} spotlightDisabled />
		);

		act(() => ref.current.showControls());

		focusSpy.mockClear();
		act(() => ref.current.hideControls());

		expect(focusSpy).not.toHaveBeenCalled();
	});

	test('should remove its global listeners and stop its timers when unmounted', () => {
		jest.useFakeTimers();
		const ref = createRef();
		const addSpy = jest.spyOn(document, 'addEventListener');
		const removeSpy = jest.spyOn(document, 'removeEventListener');

		const {unmount} = render(
			<VideoPlayer autoCloseTimeout={100} ref={ref} />
		);

		const added = addSpy.mock.calls.filter(([type]) => type === 'keydown' || type === 'wheel');
		expect(added).toHaveLength(2);

		// starts the auto-close, title-hide and feedback-hide timers
		act(() => ref.current.showControls());
		expect(jest.getTimerCount()).toBeGreaterThan(0);

		unmount();

		added.forEach(([type, fn]) => {
			expect(removeSpy).toHaveBeenCalledWith(type, fn, {capture: true});
		});
		expect(jest.getTimerCount()).toBe(0);

		jest.useRealTimers();
	});
});
