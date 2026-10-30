/* global HTMLMediaElement */

import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import Video from '../Video';

describe('VideoPlayer.Video', () => {
	beforeEach(() => {
		jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => true);
	});

	afterEach(() => {
		HTMLMediaElement.prototype.load.mockRestore();
	});

	describe('changing sources', () => {
		// Failures in these tests will often result in the following error. The error is misleading
		// but indicates the nodes aren't reused as expected.
		// TypeError: Cannot assign to read only property 'Symbol(impl)' of object '[object DOMImplementation]'

		test('should use the same node when changing the `source`', () => {
			const {rerender} = render(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			const expected = screen.getByTestId('video-id');

			rerender(
				<Video data-testid="video-id" source="def.mp4" />
			);

			const actual = screen.getByTestId('video-id');

			expect(actual).toBe(expected);
		});

		test('should not render `preloadSource` when not present', () => {
			render(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			const actual = screen.getByTestId('video-id').nextElementSibling;

			expect(actual).toBeNull();
		});

		test('should use same `source` when removing `source` and no `preload`', () => {
			const {rerender} = render(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			const expected = screen.getByTestId('video-id');

			rerender(
				<Video data-testid="video-id" source={undefined} /> // eslint-disable-line no-undefined
			);

			const actual = screen.getByTestId('video-id');

			expect(actual).toBe(expected);
		});

		test('should use same `source` when adding `source` and no `preload`', () => {
			const {rerender} = render(
				<Video data-testid="video-id" />
			);

			const expected = screen.getByTestId('video-id');

			rerender(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			const actual = screen.getByTestId('video-id');

			expect(actual).toBe(expected);
		});

		test('should use the same node when adding `preloadSource`', () => {
			const {rerender} = render(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			const expected = screen.getByTestId('video-id');

			rerender(
				<Video data-testid="video-id" preloadSource="def.mp4" source="abc.mp4" />
			);

			const actual = screen.getByTestId('video-id');

			expect(actual).toBe(expected);
		});

		test('should render `preloadSource` when added', () => {
			const {rerender} = render(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			rerender(
				<Video data-testid="video-id" preloadSource="def.mp4" source="abc.mp4" />
			);

			const actual = screen.getByTestId('video-id').nextElementSibling;

			expect(actual).not.toBeNull();
			expect(actual.tagName).toBe('VIDEO');
		});

		test('should use the same node when adding `preloadSource` the same as source', () => {
			const {rerender} = render(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			const expected = screen.getByTestId('video-id');

			rerender(
				<Video data-testid="video-id" preloadSource="abc.mp4" source="abc.mp4" />
			);

			const actual = screen.getByTestId('video-id');

			expect(actual).toBe(expected);
		});

		test('should use the same node when changing `preloadSource`', () => {
			const {rerender} = render(
				<Video data-testid="video-id" preloadSource="def.mp4" source="abc.mp4" />
			);

			const expected = screen.getByTestId('video-id').nextElementSibling;

			rerender(
				<Video data-testid="video-id" preloadSource="ghi.mp4" source="abc.mp4" />
			);

			const actual = screen.getByTestId('video-id').nextElementSibling;

			expect(actual).toBe(expected);
		});

		test('should swap nodes when swapping `source` and `preloadSource`', () => {
			const {rerender} = render(
				<Video data-testid="video-id" preloadSource="def.mp4" source="abc.mp4" />
			);

			const source = screen.getByTestId('video-id');
			const preload = screen.getByTestId('video-id').nextElementSibling;

			rerender(
				<Video data-testid="video-id" preloadSource="abc.mp4" source="def.mp4" />
			);

			const newSource = screen.getByTestId('video-id');
			const newPreload = screen.getByTestId('video-id').nextElementSibling;

			expect(newSource).toBe(preload);
			expect(newPreload).toBe(source);
		});

		test('should reuse preload node when moving `preloadSource` to `source`', () => {
			const {rerender} = render(
				<Video data-testid="video-id" preloadSource="def.mp4" source="abc.mp4" />
			);

			const preload = screen.getByTestId('video-id').nextElementSibling;

			rerender(
				<Video data-testid="video-id" preloadSource={null} source="def.mp4" />
			);

			const newSource = screen.getByTestId('video-id');
			const newPreload = screen.getByTestId('video-id').nextElementSibling;

			expect(newSource).toBe(preload);
			expect(newPreload).toBeFalsy();
		});

		test('should reuse both nodes when both `preloadSource` and `source` change', () => {
			const {rerender} = render(
				<Video data-testid="video-id" preloadSource="def.mp4" source="abc.mp4" />
			);

			const source = screen.getByTestId('video-id');
			const preload = screen.getByTestId('video-id').nextElementSibling;

			rerender(
				<Video data-testid="video-id" preloadSource="jkl.mp4" source="ghi.mp4" />
			);

			const newSource = screen.getByTestId('video-id');
			const newPreload = screen.getByTestId('video-id').nextElementSibling;

			expect(newSource).toBe(source);
			expect(newPreload).toBe(preload);
		});

		test('should reuse source node over two changes', () => {
			const {rerender} = render(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			const firstSource = screen.getByTestId('video-id');

			rerender(
				<Video data-testid="video-id" source="def.mp4" />
			);

			const secondSource = screen.getByTestId('video-id');

			expect(secondSource).toBe(firstSource);

			rerender(
				<Video data-testid="video-id" source="ghi.mp4" />
			);

			const thirdSource = screen.getByTestId('video-id');

			expect(thirdSource).toBe(firstSource);
		});

		test('should swap nodes when preload does not exist initially', () => {
			const {rerender} = render(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			const source = screen.getByTestId('video-id');

			rerender(
				<Video data-testid="video-id" preloadSource="def.mp4" source="abc.mp4" />
			);

			const preload = screen.getByTestId('video-id').nextElementSibling;

			rerender(
				<Video data-testid="video-id" preloadSource="abc.mp4" source="def.mp4" />
			);

			const newSource = screen.getByTestId('video-id');
			const newPreload = screen.getByTestId('video-id').nextElementSibling;

			expect(newSource).toBe(preload);
			expect(newPreload).toBe(source);
		});
	});

	describe('media reference', () => {
		test('should call `setMedia` with the video node when mounted', () => {
			const setMedia = jest.fn();

			render(
				<Video data-testid="video-id" ref={setMedia} source="abc.mp4" />
			);

			expect(setMedia).toHaveBeenCalled();
			expect(setMedia.mock.lastCall[0]).not.toBeNull();
		});

		test('should call `setMedia` with `null` when unmounted', () => {
			const setMedia = jest.fn();

			const {unmount} = render(
				<Video data-testid="video-id" ref={setMedia} source="abc.mp4" />
			);

			unmount();

			expect(setMedia).toHaveBeenLastCalledWith(null);
		});

		test('should clear the previous `setMedia` and set the new one when it changes', () => {
			const setMedia = jest.fn();
			const nextSetMedia = jest.fn();

			const {rerender} = render(
				<Video data-testid="video-id" ref={setMedia} source="abc.mp4" />
			);

			rerender(
				<Video data-testid="video-id" ref={nextSetMedia} source="abc.mp4" />
			);

			expect(setMedia).toHaveBeenLastCalledWith(null);
			expect(nextSetMedia).toHaveBeenCalled();
			expect(nextSetMedia.mock.lastCall[0]).not.toBeNull();
		});
	});

	describe('autoPlay', () => {
		let playSpy;

		beforeEach(() => {
			playSpy = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
		});

		afterEach(() => {
			playSpy.mockRestore();
		});

		test('should play the video when `source` changes and `autoPlay` is set', () => {
			const {rerender} = render(
				<Video autoPlay data-testid="video-id" source="abc.mp4" />
			);

			rerender(
				<Video autoPlay data-testid="video-id" source="def.mp4" />
			);

			expect(playSpy).toHaveBeenCalledTimes(1);
			expect(playSpy.mock.contexts[0]).toBe(screen.getByTestId('video-id'));
		});

		test('should not play the video when `source` changes and `autoPlay` is not set', () => {
			const {rerender} = render(
				<Video data-testid="video-id" source="abc.mp4" />
			);

			rerender(
				<Video data-testid="video-id" source="def.mp4" />
			);

			expect(playSpy).not.toHaveBeenCalled();
		});

		test('should not play the video when `source` does not change', () => {
			const {rerender} = render(
				<Video autoPlay data-testid="video-id" source="abc.mp4" />
			);

			rerender(
				<Video autoPlay data-testid="video-id" source="abc.mp4" title="new title" />
			);

			expect(playSpy).not.toHaveBeenCalled();
		});

		test('should handle `play()` not returning a promise', () => {
			playSpy.mockImplementation(() => {});

			const {rerender} = render(
				<Video autoPlay data-testid="video-id" source="abc.mp4" />
			);

			expect(() => {
				rerender(
					<Video autoPlay data-testid="video-id" source="def.mp4" />
				);
			}).not.toThrow();
			expect(playSpy).toHaveBeenCalledTimes(1);
		});

		test('should handle autoplay being prevented', () => {
			const handleCatch = jest.fn();
			const handleThen = jest.fn(() => ({catch: handleCatch}));

			playSpy.mockImplementation(() => ({then: handleThen}));

			const {rerender} = render(
				<Video autoPlay data-testid="video-id" source="abc.mp4" />
			);

			rerender(
				<Video autoPlay data-testid="video-id" source="def.mp4" />
			);

			expect(handleThen).toHaveBeenCalledWith(expect.any(Function));
			expect(handleCatch).toHaveBeenCalledWith(expect.any(Function));

			// neither callback should throw when the promise settles
			expect(() => handleThen.mock.calls[0][0]()).not.toThrow();
			expect(() => handleCatch.mock.calls[0][0](new Error('NotAllowedError'))).not.toThrow();
		});
	});

	describe('preloading', () => {
		let playSpy;

		beforeEach(() => {
			playSpy = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
		});

		afterEach(() => {
			playSpy.mockRestore();
		});

		test('should load the preload video when it is rendered', () => {
			render(
				<Video data-testid="video-id" preloadSource="def.mp4" source="abc.mp4" />
			);

			const preload = screen.getByTestId('video-id').nextElementSibling;

			expect(HTMLMediaElement.prototype.load.mock.contexts).toContain(preload);
		});

		test('should reload the preload video when `preloadSource` changes', () => {
			const {rerender} = render(
				<Video data-testid="video-id" preloadSource="def.mp4" source="abc.mp4" />
			);

			const preload = screen.getByTestId('video-id').nextElementSibling;
			HTMLMediaElement.prototype.load.mockClear();

			rerender(
				<Video data-testid="video-id" preloadSource="ghi.mp4" source="abc.mp4" />
			);

			expect(HTMLMediaElement.prototype.load.mock.contexts).toContain(preload);
		});

		test('should discard the cached `onLoadStart` when `preloadSource` changes to a different value', () => {
			const handleLoadStart = jest.fn();
			const handleUpdate = jest.fn();

			const {rerender} = render(
				<Video autoPlay data-testid="video-id" onLoadStart={handleLoadStart} onUpdate={handleUpdate} preloadSource="def.mp4" source="abc.mp4" />
			);

			const video = screen.getByTestId('video-id');
			const preload = video.nextElementSibling;

			// cache the `loadstart` of the first preload source
			fireEvent(preload, new Event('loadstart'));

			rerender(
				<Video autoPlay data-testid="video-id" onLoadStart={handleLoadStart} onUpdate={handleUpdate} preloadSource="ghi.mp4" source="abc.mp4" />
			);

			// changing only the preload keeps both video elements and does not touch the active video
			expect(screen.getByTestId('video-id')).toBe(video);
			expect(video.nextElementSibling).toBe(preload);
			expect(preload.querySelector('source')).toHaveAttribute('src', 'ghi.mp4');
			expect(handleLoadStart).not.toHaveBeenCalled();
			expect(handleUpdate).not.toHaveBeenCalled();
			expect(playSpy).not.toHaveBeenCalled();

			// promote the new preload before it started loading
			rerender(
				<Video autoPlay data-testid="video-id" onLoadStart={handleLoadStart} onUpdate={handleUpdate} source="ghi.mp4" />
			);

			// the `loadstart` cached for the previous preload source is not re-emitted
			expect(handleLoadStart).not.toHaveBeenCalled();
			expect(handleUpdate).toHaveBeenCalledTimes(1);
			expect(handleUpdate).toHaveBeenCalledWith({type: 'onUpdate'});
			expect(playSpy).toHaveBeenCalledTimes(1);
			expect(playSpy.mock.contexts[0]).toBe(preload);
			expect(screen.getByTestId('video-id')).toBe(preload);
		});

		test('should not forward `onLoadStart` when the preload video starts loading', () => {
			const handleLoadStart = jest.fn();

			render(
				<Video data-testid="video-id" onLoadStart={handleLoadStart} preloadSource="def.mp4" source="abc.mp4" />
			);

			const preload = screen.getByTestId('video-id').nextElementSibling;

			fireEvent(preload, new Event('loadstart'));

			expect(handleLoadStart).not.toHaveBeenCalled();
		});

		test('should forward the cached `onLoadStart` and `onUpdate` when the preload video becomes the source', () => {
			const handleLoadStart = jest.fn();
			const handleUpdate = jest.fn();

			const {rerender} = render(
				<Video autoPlay data-testid="video-id" onLoadStart={handleLoadStart} onUpdate={handleUpdate} preloadSource="def.mp4" source="abc.mp4" />
			);

			const preload = screen.getByTestId('video-id').nextElementSibling;

			fireEvent(preload, new Event('loadstart'));

			rerender(
				<Video autoPlay data-testid="video-id" onLoadStart={handleLoadStart} onUpdate={handleUpdate} preloadSource="ghi.mp4" source="def.mp4" />
			);

			expect(handleLoadStart).toHaveBeenCalledTimes(1);
			expect(handleLoadStart.mock.calls[0][0]).toHaveProperty('type', 'loadstart');
			expect(handleUpdate).toHaveBeenCalledWith({type: 'onUpdate'});
			expect(playSpy).toHaveBeenCalledTimes(1);
			expect(playSpy.mock.contexts[0]).toBe(preload);
		});

		test('should only forward `onUpdate` when the preload video becomes the source before it started loading', () => {
			const handleLoadStart = jest.fn();
			const handleUpdate = jest.fn();

			const {rerender} = render(
				<Video data-testid="video-id" onLoadStart={handleLoadStart} onUpdate={handleUpdate} preloadSource="def.mp4" source="abc.mp4" />
			);

			rerender(
				<Video data-testid="video-id" onLoadStart={handleLoadStart} onUpdate={handleUpdate} preloadSource="ghi.mp4" source="def.mp4" />
			);

			expect(handleLoadStart).not.toHaveBeenCalled();
			expect(handleUpdate).toHaveBeenCalledWith({type: 'onUpdate'});
		});
	});

	describe('source elements', () => {
		test('should render `<source>` children as the video and preload sources', () => {
			render(
				<Video data-testid="video-id">
					<source src="abc.mp4" type="video/mp4" />
					<source slot="preloadSource" src="def.mp4" type="video/mp4" />
				</Video>
			);

			const video = screen.getByTestId('video-id');
			const preload = video.nextElementSibling;

			expect(video.querySelector('source')).toHaveAttribute('src', 'abc.mp4');
			expect(video.querySelector('source')).toHaveAttribute('type', 'video/mp4');
			expect(preload.querySelector('source')).toHaveAttribute('src', 'def.mp4');
			expect(preload.querySelector('source')).toHaveAttribute('type', 'video/mp4');
		});
	});
});
