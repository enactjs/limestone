import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';

import Card, {CardBase} from '../Card';

const src = {
	'hd': 'https://placehold.co/200x200/000000/ffffff/png',
	'fhd': 'https://placehold.co/300x300/000000/ffffff/png',
	'uhd': 'https://placehold.co/600x600/000000/ffffff/png'
};

describe('Card', () => {
	test('should support `captionOverlay` prop', () => {
		const children = 'children';
		render(<CardBase data-testid="card" captionOverlay src={src}>{children}</CardBase>);

		const expected = 'captionOverlay';
		const actual = screen.getByTestId('card');

		expect(actual).toHaveClass(expected);
	});

	test('should support `roundedImage` prop', () => {
		render(<CardBase data-testid="card" roundedImage src={src} />);

		const expected = 'roundedImage';
		const actual = screen.getByTestId('card');

		expect(actual).toHaveClass(expected);
	});

	test('should support `hasContainer` prop', () => {
		render(<CardBase data-testid="card" hasContainer src={src} />);

		const expected = 'hasContainer';
		const actual = screen.getByTestId('card');

		expect(actual).toHaveClass(expected);
	});

	test('should support `imageIconSrc` prop when `orientation="vertical"`', () => {
		const imageIconSrc = 'imageIconSrc';
		render(<CardBase imageIconSrc={imageIconSrc} orientation="vertical" src={src} />);

		const expected = imageIconSrc;
		const actual = screen.getAllByRole('img')[2].children.item(0);

		expect(actual).toHaveAttribute('src', expected);
	});

	test('should not support `imageIconSrc` prop when `orientation="horizontal"`', () => {
		const imageIconSrc = 'imageIconSrc';
		render(<CardBase imageIconSrc={imageIconSrc} orientation="horizontal" src={src} />);

		const expected = 2;
		const actual = screen.getAllByRole('img').length;

		expect(actual).toBe(expected);
	});

	test('should apply prop `fitImage`', () => {
		const imageIconSrc = 'imageIconSrc';
		render(<CardBase data-testid="card" fitImage imageIconSrc={imageIconSrc} src={src} />);

		const expected = 'fitImage';
		const actual = screen.getByTestId('card');

		expect(actual).toHaveClass(expected);
	});

	test('should have "Select" voice intent', () => {
		render(<CardBase data-testid="card" src={src} />);
		const card = screen.getByTestId('card');

		expect(card).toHaveAttribute('data-webos-voice-intent', 'Select');
	});

	test('should not have styles for marquee when `withoutMarquee` is true', () => {
		const children = 'children';
		render(<CardBase data-testid="card" withoutMarquee src={src}>{children}</CardBase>);

		const expected = 'style';
		const actual = screen.getByText('children');

		expect(actual).not.toHaveAttribute(expected);
	});

	test('should be pressed when selected', () => {
		render(<Card data-testid="card" src={src} />);
		const card = screen.getByTestId('card');

		// Select by key
		fireEvent.keyDown(card, {key: 'Enter', code: 'Enter', keyCode: 13, which: 13});
		expect(card).toHaveClass('pressed');

		fireEvent.keyUp(card, {key: 'Enter', code: 'Enter', keyCode: 13, which: 13});
		expect(card).not.toHaveClass('pressed');

		// Select by pointer
		fireEvent.mouseDown(card);
		expect(card).toHaveClass('pressed');

		fireEvent.mouseUp(card);
		expect(card).not.toHaveClass('pressed');
	});

	test('should format a negative duration as "00:00" in the image overlay', () => {
		render(<CardBase src={src} showDuration durationOverlay duration={-1} />);

		expect(screen.getByText('00:00')).toBeInTheDocument();
	});

	test('should format a duration of one hour or more as HH:MM:SS in the captions', () => {
		render(<CardBase src={src} showDuration duration={3661} />);

		expect(screen.getByText('01:01:01')).toBeInTheDocument();
	});

	test('should render an array of `captionImageIconsSrc` as Images in the captions', () => {
		render(
			<CardBase
				src={src}
				captionImageIconsSrc={[src.hd, src.hd]}
			/>
		);

		expect(screen.queryAllByRole('img')).toHaveLength(6);
	});

	test('should render a React element passed as `imageIconSrc`', () => {
		render(
			<CardBase
				src={src}
				imageIconSrc={<div data-testid="custom-image-icon" />}
			/>
		);

		expect(screen.getByTestId('custom-image-icon')).toBeInTheDocument();
	});

	test('should render `label` without icons when `labelIcons` is not provided', () => {
		render(<CardBase src={src} label="Label text" />);

		expect(screen.getByText('Label text')).toBeInTheDocument();
	});

	test('should render `labelIcons` alongside the `label`', () => {
		render(
			<CardBase
				src={src}
				label="Label text"
				labelIcons={[
					<div data-testid="label-icon-1" />,
					<div data-testid="label-icon-2" />

				]}
				secondaryLabel="Secondary label"
				secondaryLabelIcons={[<div data-testid="secondary-label-icon" />]}
			/>
		);

		expect(screen.getByTestId('label-icon-1')).toBeInTheDocument();
		expect(screen.getByTestId('label-icon-2')).toBeInTheDocument();
		expect(screen.getByTestId('secondary-label-icon')).toBeInTheDocument();
	});

	test('should render `labelIcons` alongside the `label` in `withoutMarquee` mode', () => {
		render(
			<CardBase
				src={src}
				withoutMarquee
				label="Label"
				labelIcons={[<div key="icon1" data-testid="label-icon" />]}
			/>
		);

		expect(screen.getByTestId('label-icon')).toBeInTheDocument();
	});

	test('should render `primaryBadge` string in the image overlay', () => {
		render(<CardBase src={src} primaryBadge="Primary Badge" />);

		expect(screen.getByText('Primary Badge')).toBeInTheDocument();
	});

	test('should render `secondaryBadge` string in the image overlay', () => {
		render(<CardBase src={src} secondaryBadge="Secondary Badge" />);

		expect(screen.getByText('Secondary Badge')).toBeInTheDocument();
	});

	test('should render `ProgressBar` in the image overlay when `progressBarOverlay` is true', () => {
		render(<CardBase src={src} showProgressBar progressBarOverlay progress={0.5} />);

		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});
});
