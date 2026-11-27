import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';

import WindowEventable from '../WindowEventable';

const Base = (props) => <div data-testid="base" {...props} />;

describe('WindowEventable', () => {
	test('should call a configured function with the event and the props for window events', () => {
		const handleKeyDown = jest.fn();
		const Component = WindowEventable({onKeyDown: handleKeyDown}, Base);

		render(<Component title="keys" />);
		fireEvent.keyDown(window, {keyCode: 13});

		expect(handleKeyDown).toHaveBeenCalledTimes(1);
		expect(handleKeyDown.mock.calls[0][0]).toMatchObject({type: 'keydown', keyCode: 13});
		expect(handleKeyDown.mock.calls[0][1]).toMatchObject({title: 'keys'});
	});

	test('should listen on the document when `globalNode` is "document"', () => {
		const handleClick = jest.fn();
		const Component = WindowEventable({globalNode: 'document', onClick: handleClick}, Base);

		render(<Component />);
		fireEvent.click(document);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test('should stop listening when unmounted', () => {
		const handleKeyDown = jest.fn();
		const Component = WindowEventable({onKeyDown: handleKeyDown}, Base);

		const {unmount} = render(<Component />);
		unmount();
		fireEvent.keyDown(window, {keyCode: 13});

		expect(handleKeyDown).not.toHaveBeenCalled();
	});

	test('should not pass the configured event props to the wrapped component', () => {
		const Component = WindowEventable({onKeyDown: () => {}}, Base);

		render(<Component onKeyDown={() => {}} />);
		const base = screen.getByTestId('base');

		expect(base.onkeydown).toBeNull();
	});
});
