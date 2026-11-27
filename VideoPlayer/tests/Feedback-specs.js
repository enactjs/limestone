import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {FeedbackBase as Feedback} from '../Feedback';
import {FeedbackTooltipBase as FeedbackTooltip} from '../FeedbackTooltip';

describe('Feedback', () => {
	test('should show the playback rate for a fast forward', () => {
		render(<Feedback playbackState="fastForward">{2}</Feedback>);

		expect(screen.getByText('2x')).toBeInTheDocument();
	});

	test('should show the playback rate of a rewind without its sign', () => {
		render(<Feedback playbackState="rewind">{-4}</Feedback>);

		expect(screen.getByText('4x')).toBeInTheDocument();
	});

	test('should not show a playback rate at normal speed', () => {
		render(<Feedback data-testid="feedback" playbackState="fastForward">{1}</Feedback>);

		const feedback = screen.getByTestId('feedback');
		expect(feedback.querySelector('.message')).toBeNull();
	});

	test('should show "Pause" when paused', () => {
		render(<Feedback playbackState="pause">{1}</Feedback>);

		expect(screen.getByText('Pause')).toBeInTheDocument();
	});

	test('should show a custom message without an icon when there is no playback state', () => {
		render(<Feedback data-testid="feedback">Custom message</Feedback>);

		expect(screen.getByText('Custom message')).toBeInTheDocument();
		const feedback = screen.getByTestId('feedback');
		expect(feedback.querySelector('.icon')).toBeNull();
	});

	test('should be hidden when not visible', () => {
		render(<Feedback data-testid="feedback" playbackState="play" visible={false} />);

		expect(screen.getByTestId('feedback')).toHaveClass('hidden');
	});
});

describe('FeedbackTooltip', () => {
	const formatter = {format: () => '00:30'};
	const tooltipProps = {duration: 60, formatter, playbackState: 'play'};

	test('should show the thumbnail image from `thumbnailSrc` while the slider is focused', () => {
		render(<FeedbackTooltip {...tooltipProps} action="focus" data-testid="tooltip" thumbnailSrc="thumbnail.png">{0.5}</FeedbackTooltip>);

		const tooltip = screen.getByTestId('tooltip');

		expect(tooltip).toHaveClass('shift');
		expect(tooltip.querySelector('.thumbnail img')).toHaveAttribute('src', 'thumbnail.png');
		expect(tooltip.querySelector('.arrowContainer')).not.toHaveClass('hidden');
	});

	test('should show a custom `thumbnailComponent` while the slider is focused', () => {
		render(
			<FeedbackTooltip {...tooltipProps} action="focus" thumbnailComponent={<div data-testid="custom-thumbnail" />}>
				{0.5}
			</FeedbackTooltip>
		);

		expect(screen.getByTestId('custom-thumbnail')).toHaveClass('thumbnail');
	});

	test('should not show a thumbnail when the slider is not focused', () => {
		render(<FeedbackTooltip {...tooltipProps} action="idle" data-testid="tooltip" thumbnailSrc="thumbnail.png">{0.5}</FeedbackTooltip>);

		const tooltip = screen.getByTestId('tooltip');

		expect(tooltip.querySelector('.thumbnail')).toBeNull();
		expect(tooltip).not.toHaveClass('shift');
		expect(tooltip.querySelector('.arrowContainer')).toHaveClass('hidden');
	});

	test('should show the formatted time of the position', () => {
		render(<FeedbackTooltip {...tooltipProps} action="idle">{0.5}</FeedbackTooltip>);

		expect(screen.getByText('00:30')).toBeInTheDocument();
	});
});
