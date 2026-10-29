import {addAll} from '@enact/core/keymap';
import Spotlight from '@enact/spotlight';
import {act, fireEvent, render} from '@testing-library/react';

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
	beforeEach(() => {
		jest.spyOn(Spotlight, 'getCurrent').mockReturnValue(null);
	});

	afterEach(() => {
		jest.restoreAllMocks();
		jest.useRealTimers();
	});

	test('should pulse a hidden jump and forward playback keys', () => {
		jest.useFakeTimers();
		const handleFastForward = jest.fn();
		const handleJump = jest.fn();
		const handlePause = jest.fn();
		const handlePlay = jest.fn();
		const handleRewind = jest.fn();

		render(
			<MediaControls
				id="mediaControls"
				visible={false}
				onFastForward={handleFastForward}
				onJump={handleJump}
				onPause={handlePause}
				onPlay={handlePlay}
				onRewind={handleRewind}
			/>
		);

		key('keyDown', 37);

		act(() => {
			jest.advanceTimersByTime(400);
		});

		key('keyDown', 37);
		key('keyDown', 39);
		key('keyUp', 39);
		fireEvent.blur(window);
		key('keyUp', 415);
		key('keyUp', 19);
		key('keyUp', 412);
		key('keyUp', 417);

		expect(handleJump).toHaveBeenCalled();
		expect(handlePlay).toHaveBeenCalled();
		expect(handlePause).toHaveBeenCalled();
		expect(handleRewind).toHaveBeenCalled();
		expect(handleFastForward).toHaveBeenCalled();
	});
});
