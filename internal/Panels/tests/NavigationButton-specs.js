import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import Button from '../../../Button';
import NavigationButton from '../NavigationButton';

describe('NavigationButton Specs', () => {
	test('should render a default Button when visible', () => {
		render(<NavigationButton aria-label="Next" icon="arrowlargeright" visible />);

		expect(screen.getByRole('button', {name: 'Next'})).toBeInTheDocument();
	});

	test('should render nothing when using the default button and not visible', () => {
		render(<NavigationButton aria-label="Next" visible={false} />);

		expect(screen.queryByRole('button')).toBeNull();
	});

	test.each([
		['false', false],
		['null', null]
	])('should render nothing when `component` is %s even if visible', (_, component) => {
		render(<NavigationButton aria-label="Next" component={component} visible />);

		expect(screen.queryByRole('button')).toBeNull();
	});

	test('should render a custom component type with the navigation props', () => {
		const handleClick = jest.fn();
		const CustomButton = ({onClick, ...rest}) => <button {...rest} data-testid="custom" onClick={onClick} />;

		render(<NavigationButton aria-label="Next" component={CustomButton} onClick={handleClick} visible />);

		const button = screen.getByTestId('custom');
		fireEvent.click(button);

		expect(button).toHaveAttribute('aria-label', 'Next');
		expect(handleClick).toHaveBeenCalled();
	});

	test('should render a custom element using its own props over the navigation props', () => {
		render(
			<NavigationButton
				aria-label="Next"
				component={<Button aria-label="Custom next" icon="star" />}
				icon="arrowlargeright"
				visible
			/>
		);

		const button = screen.getByRole('button', {name: 'Custom next'});
		const star = 983080; // decimal converted charCode of Unicode 'star' character

		expect(button.textContent.codePointAt()).toBe(star);
	});

	test('should use the navigation props for props the custom element leaves undefined, except aria props', () => {
		const handleClick = jest.fn();

		render(
			<NavigationButton
				aria-label="Next"
				// An explicitly undefined prop falls back to the navigation prop
				component={<Button data-testid="custom" icon={undefined} />} // eslint-disable-line no-undefined
				icon="arrowlargeright"
				onClick={handleClick}
				visible
			/>
		);

		const button = screen.getByTestId('custom');
		fireEvent.click(button);

		// aria props are not applied to a custom element, so it can provide its own accessible name
		expect(button).not.toHaveAttribute('aria-label');
		expect(handleClick).toHaveBeenCalled();
		expect(button.querySelector('.icon')).not.toBeNull();
	});

	test('should render a custom element even when not visible', () => {
		render(<NavigationButton component={<Button aria-label="Custom" />} visible={false} />);

		expect(screen.getByRole('button', {name: 'Custom'})).toBeInTheDocument();
	});
});
