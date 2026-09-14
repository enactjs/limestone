import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import {useEffect} from 'react';

import AsyncRenderChildren from '../AsyncRenderChildren';

let data: Record<string, any> = {};
const Component = (props: Record<string, any>) => {
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
});
