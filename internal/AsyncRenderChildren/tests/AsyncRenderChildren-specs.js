import '@testing-library/jest-dom';
import {act, render, screen} from '@testing-library/react';
import {useEffect} from 'react';

import AsyncRenderChildren from '../AsyncRenderChildren';

let data = {};
const Component = (props) => {
	useEffect(() => {
		data = props;
	}, [props]);

	return <AsyncRenderChildren {...props} />;
};

describe('AsyncRenderChildren', () => {
	test('should have a fallback content', () => {
		render(<Component fallback={<div>Loading...</div>} index={1}>children</Component>);

		const fallbackContent = data.fallback.props.children;

		expect(fallbackContent).toBe('Loading...');
	});

	test('should have a fallback content after changing index', () => {
		const {rerender} = render(<Component fallback={<div>Loading...</div>} index={1}>children</Component>);

		rerender(<Component fallback={<div>Loading...</div>} index={2}>children</Component>);

		const fallbackContent = data.fallback.props.children;

		expect(fallbackContent).toBe('Loading...');
	});

	test('should render the fallback right after the index changes and the children after a delay', () => {
		jest.useFakeTimers();

		const {rerender} = render(<AsyncRenderChildren fallback={<div>Loading...</div>} index={1}><div>children</div></AsyncRenderChildren>);

		expect(screen.getByText('children')).toBeInTheDocument();

		rerender(<AsyncRenderChildren fallback={<div>Loading...</div>} index={2}><div>children</div></AsyncRenderChildren>);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.queryByText('children')).toBeNull();

		act(() => jest.runAllTimers());

		expect(screen.getByText('children')).toBeInTheDocument();

		jest.useRealTimers();
	});

	test('should not render the children of a previous index when the index changes again', () => {
		jest.useFakeTimers();

		const {rerender, unmount} = render(<AsyncRenderChildren fallback={<div>Loading...</div>} index={1}><div>children</div></AsyncRenderChildren>);

		rerender(<AsyncRenderChildren fallback={<div>Loading...</div>} index={2}><div>children</div></AsyncRenderChildren>);
		unmount();

		expect(() => act(() => jest.runAllTimers())).not.toThrow();

		jest.useRealTimers();
	});
});
