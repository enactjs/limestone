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

describe('VideoPlayer 5-way jumping', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
		jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
		jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
	});

	afterEach(() => {
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	// The hidden handle at the top of the player receives the 5-way keys while the controls are hidden
	const getHandle = () => document.querySelector('.controlsHandleAbove');

	const renderLoaded = (props) => {
		const ref = createRef();
		render(<VideoPlayer data-testid="videoplayer-id" noAutoPlay ref={ref} {...props} />);
		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		return {ref, video};
	};

	const pressOnHandle = (keyCode) => {
		fireEvent.keyDown(getHandle(), {keyCode});
		fireEvent.keyUp(getHandle(), {keyCode});
	};

	test.each([
		['forward', 39, 80],
		['backward', 37, 20]
	])('should jump %s by `jumpBy` seconds with 5-way while the controls are hidden', (_, keyCode, expected) => {
		const {video} = renderLoaded();

		pressOnHandle(keyCode);

		expect(video.currentTime).toBe(expected);
	});

	test('should jump by a custom `jumpBy`', () => {
		const {video} = renderLoaded({jumpBy: 5});

		pressOnHandle(39);

		expect(video.currentTime).toBe(55);
	});

	test('should fire `onSeekFailed` instead of jumping when `seekDisabled`', () => {
		const handleSeekFailed = jest.fn();
		const {video} = renderLoaded({onSeekFailed: handleSeekFailed, seekDisabled: true});

		pressOnHandle(39);

		expect(handleSeekFailed).toHaveBeenCalled();
		expect(video.currentTime).toBe(50);
	});

	test('should fire `onSeekOutsideSelection` and still jump when jumping outside the `selection`', () => {
		const handleSeekOutsideSelection = jest.fn();
		const {video} = renderLoaded({onSeekOutsideSelection: handleSeekOutsideSelection, selection: [40, 60]});

		pressOnHandle(39);

		expect(handleSeekOutsideSelection).toHaveBeenCalledWith(expect.objectContaining({type: 'onSeekOutsideSelection', time: 80}));
		expect(video.currentTime).toBe(80);
	});

	test('should not jump outside the `selection` when `onSeekOutsideSelection` prevents it', () => {
		const handleSeekOutsideSelection = jest.fn((ev) => ev.preventDefault());
		const {video} = renderLoaded({onSeekOutsideSelection: handleSeekOutsideSelection, selection: [40, 60]});

		pressOnHandle(39);

		expect(handleSeekOutsideSelection).toHaveBeenCalled();
		expect(video.currentTime).toBe(50);
	});

	test('should jump within the `selection` without firing `onSeekOutsideSelection`', () => {
		const handleSeekOutsideSelection = jest.fn();
		const {video} = renderLoaded({jumpBy: 5, onSeekOutsideSelection: handleSeekOutsideSelection, selection: [40, 60]});

		pressOnHandle(39);

		expect(handleSeekOutsideSelection).not.toHaveBeenCalled();
		expect(video.currentTime).toBe(55);
	});

	test('should move spotlight instead of jumping when `no5WayJump` is set', () => {
		const moveSpy = jest.spyOn(Spotlight, 'move').mockReturnValue(true);
		const {video} = renderLoaded({no5WayJump: true});

		pressOnHandle(39);

		expect(moveSpy).toHaveBeenCalledWith('right');
		expect(video.currentTime).toBe(50);
	});

	test('should show the controls when enter is pressed on the hidden handle', () => {
		const {ref} = renderLoaded();

		pressOnHandle(13);

		expect(ref.current.areControlsVisible()).toBe(true);
	});

	test('should show the controls when the down key is pressed while they are hidden', () => {
		const {ref} = renderLoaded();

		fireEvent.keyDown(document.body, {keyCode: 40});

		expect(ref.current.areControlsVisible()).toBe(true);
	});

	test('should not show the controls on the down key when `spotlightDisabled`', () => {
		const {ref} = renderLoaded({spotlightDisabled: true});

		fireEvent.keyDown(document.body, {keyCode: 40});

		expect(ref.current.areControlsVisible()).toBe(false);
	});
});

describe('VideoPlayer API', () => {
	beforeEach(() => {
		jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
		jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
		jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test('should refuse playback commands while the source is unavailable', () => {
		const ref = createRef();
		render(<VideoPlayer ref={ref} />);

		const results = {};
		act(() => {
			results.play = ref.current.play();
			results.pause = ref.current.pause();
			results.jump = ref.current.jump(10);
			results.rewind = ref.current.rewind();
			results.setPlaybackSpeed = ref.current.setPlaybackSpeed(2);
		});

		expect(results).toEqual({play: false, pause: false, jump: false, rewind: false, setPlaybackSpeed: false});
	});

	test('should seek to a given time', () => {
		const ref = createRef();
		render(<VideoPlayer data-testid="videoplayer-id" noAutoPlay ref={ref} />);
		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		act(() => ref.current.seek(30));

		expect(video.currentTime).toBe(30);
	});

	test('should fire `onSeekFailed` when seeking with `seekDisabled`', () => {
		const ref = createRef();
		const handleSeekFailed = jest.fn();
		render(<VideoPlayer data-testid="videoplayer-id" noAutoPlay onSeekFailed={handleSeekFailed} ref={ref} seekDisabled />);
		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		act(() => ref.current.seek(30));

		expect(handleSeekFailed).toHaveBeenCalled();
		expect(video.currentTime).toBe(50);
	});

	test('should set an arbitrary playback speed', () => {
		const ref = createRef();
		render(<VideoPlayer data-testid="videoplayer-id" noAutoPlay ref={ref} />);
		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		let result;
		act(() => {
			result = ref.current.setPlaybackSpeed(1.5);
		});

		expect(result).toBe(true);
		expect(video.playbackRate).toBe(1.5);
	});

	test('should set properties and call methods of the video through its node proxy', () => {
		const ref = createRef();
		render(<VideoPlayer data-testid="videoplayer-id" noAutoPlay ref={ref} />);
		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		const node = ref.current.getVideoNode();
		node.currentTime = 25;
		node.play();

		expect(video.currentTime).toBe(25);
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
	});
});

describe('VideoPlayer media controls', () => {
	beforeEach(() => {
		jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
		jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
		jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const renderWithControls = (props) => {
		const ref = createRef();
		render(<VideoPlayer data-testid="videoplayer-id" noAutoPlay ref={ref} {...props} />);
		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);
		act(() => ref.current.showControls());

		return {ref, video};
	};

	test.each([
		['Next', 80],
		['Previous', 20]
	])('should jump with the `%s` button when there is no playlist handler', async (label, expected) => {
		const user = userEvent.setup();
		const {video} = renderWithControls();

		await user.click(screen.getByLabelText(label));

		expect(video.currentTime).toBe(expected);
	});

	test.each([
		['Next', 'onNext', 'onWillNext'],
		['Previous', 'onPrevious', 'onWillPrevious']
	])('should fire `%s` button events instead of jumping when `%s` is set', async (label, handlerName, willHandlerName) => {
		const user = userEvent.setup();
		const handler = jest.fn();
		const willHandler = jest.fn();
		const {video} = renderWithControls({[handlerName]: handler, [willHandlerName]: willHandler});

		await user.click(screen.getByLabelText(label));

		expect(willHandler).toHaveBeenCalledWith(expect.objectContaining({type: willHandlerName}));
		expect(handler).toHaveBeenCalledWith(expect.objectContaining({type: handlerName}));
		expect(video.currentTime).toBe(50);
	});

	test('should hide the controls when they are closed with the back key', () => {
		const {ref} = renderWithControls();

		fireEvent.keyUp(screen.getByLabelText('Play'), {keyCode: 27});

		expect(ref.current.areControlsVisible()).toBe(false);
	});

	test('should move focus to the media buttons with the down key from the slider', () => {
		const focusSpy = jest.spyOn(Spotlight, 'focus');
		renderWithControls({spotlightId: 'player'});

		fireEvent.keyDown(screen.getByRole('slider', {hidden: true}), {keyCode: 40});

		expect(focusSpy).toHaveBeenCalledWith('player_mediaControls');
	});

	test('should report the time under the knob with `onScrub` while scrubbing with the slider', () => {
		const handleScrub = jest.fn();
		renderWithControls({onScrub: handleScrub});
		const slider = screen.getByRole('slider', {hidden: true});

		fireEvent.focus(slider);
		fireEvent.keyDown(slider, {keyCode: 39});

		expect(handleScrub).toHaveBeenCalledWith(expect.objectContaining({type: 'onScrub', seconds: expect.any(Number)}));
	});
});

describe('VideoPlayer media events', () => {
	let pauseSpy;

	beforeEach(() => {
		jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
		pauseSpy = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
		jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test.each([
		['pause', true],
		['keep playing', false]
	])('should %s at the end of a fast forward when `pauseAtEnd` is %s', (_, pauseAtEnd) => {
		const ref = createRef();
		render(<VideoPlayer data-testid="videoplayer-id" pauseAtEnd={pauseAtEnd} ref={ref} />);
		const video = screen.getByTestId('videoplayer-id');
		loadVideo(video);

		act(() => ref.current.fastForward());
		pauseSpy.mockClear();

		video.currentTime = 100;
		fireEvent(video, new Event('timeupdate'));

		expect(pauseSpy.mock.calls.length > 0).toBe(pauseAtEnd);
	});

	test('should show the controls when a new source starts loading', async () => {
		const ref = createRef();
		render(<VideoPlayer data-testid="videoplayer-id" ref={ref} />);

		fireEvent(screen.getByTestId('videoplayer-id'), new Event('loadstart'));

		await waitFor(() => {
			expect(ref.current.areControlsVisible()).toBe(true);
		});
	});

	test('should not show the controls when a new source starts loading with `noAutoShowMediaControls`', async () => {
		jest.useFakeTimers();
		const ref = createRef();
		render(<VideoPlayer data-testid="videoplayer-id" noAutoShowMediaControls ref={ref} />);

		fireEvent(screen.getByTestId('videoplayer-id'), new Event('loadstart'));
		act(() => jest.advanceTimersByTime(1000));

		expect(ref.current.areControlsVisible()).toBe(false);
		jest.useRealTimers();
	});
});
