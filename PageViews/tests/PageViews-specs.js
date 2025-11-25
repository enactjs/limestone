import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {PageViews, Page} from '../';

describe('PageViews Specs', () => {
	test(
		'should show next button and hide previous button on the first page',
		() => {
			render(
				<PageViews index={0}>
					<Page>I got contents</Page>
					<Page>I got contents</Page>
				</PageViews>
			);

			const nextButton = screen.getByLabelText('Next');
			const prevButton = screen.queryByLabelText('Previous');

			expect(nextButton).toBeInTheDocument();
			expect(prevButton).toBeNull();
		}
	);

	test(
		'should show next button and hide previous button on the first page when pageIndicatorType is `number`',
		() => {
			render(
				<PageViews pageIndicatorType="number" index={0}>
					<Page>I got contents</Page>
					<Page>I got contents</Page>
				</PageViews>
			);

			const nextButton = screen.getByLabelText('Next');
			const prevButton = screen.queryByLabelText('Previous');

			expect(nextButton).toBeInTheDocument();
			expect(prevButton).toBeNull();
		}
	);

	test(
		'should show previous button and hide next button on the last page',
		() => {
			render(
				<PageViews index={1}>
					<Page>I got contents</Page>
					<Page>I got contents</Page>
				</PageViews>
			);

			const prevButton = screen.getByLabelText('Previous');
			const nextButton = screen.queryByLabelText('Next');

			expect(prevButton).toBeInTheDocument();
			expect(nextButton).toBeNull();
		}
	);

	test(
		'should show previous button and hide next button on the last page when pageIndicatorType is `number`',
		() => {
			render(
				<PageViews pageIndicatorType="number" index={1}>
					<Page>I got contents</Page>
					<Page>I got contents</Page>
				</PageViews>
			);

			const prevButton = screen.getByLabelText('Previous');
			const nextButton = screen.queryByLabelText('Next');

			expect(prevButton).toBeInTheDocument();
			expect(nextButton).toBeNull();
		}
	);

	test(
		'should fire onTransition with target index and type',
		async () => {
			const spy = jest.fn();
			let index = 0;
			const {rerender} = render(
				<PageViews index={index} onTransition={spy} noAnimation>
					<Page>I got contents</Page>
					<Page>I got contents2</Page>
				</PageViews>
			);

			spy.mockClear();
			index++;

			rerender(
				<PageViews index={index} onTransition={spy} noAnimation>
					<Page>I got contents</Page>
					<Page>I got contents2</Page>
				</PageViews>
			);

			const expected = {index, type: 'onTransition'};
			const actual = spy.mock.calls.length && spy.mock.calls[0][0];

			await waitFor(() => {
				expect(actual).toMatchObject(expected);
			});
		}
	);

	test(
		'should fire onWillTransition with target index and type',
		async () => {
			const spy = jest.fn();
			let index = 0;
			const {rerender} = render(
				<PageViews index={index} onWillTransition={spy} noAnimation>
					<Page>I got contents</Page>
					<Page>I got contents2</Page>
				</PageViews>
			);

			spy.mockClear();
			index++;

			rerender(
				<PageViews index={index} onWillTransition={spy} noAnimation>
					<Page>I got contents</Page>
					<Page>I got contents2</Page>
				</PageViews>
			);

			const expected = {index, type: 'onWillTransition'};
			const actual = spy.mock.calls.length && spy.mock.calls[0][0];

			await waitFor(() => {
				expect(actual).toMatchObject(expected);
			});
		}
	);

	test(
		'should fire `onNextClick` and `onChange` with type when go to the next page',
		async () => {
			const handleChange = jest.fn();
			const handleNextClick = jest.fn();
			const user = userEvent.setup();

			render(
				<PageViews index={1} onChange={handleChange} onNextClick={handleNextClick}>
					<Page />
					<Page />
					<Page />
				</PageViews>
			);

			const nextButton = screen.getByLabelText('Next');
			const expected = {type: 'onNextClick'};

			await user.click(nextButton);

			await waitFor(() => {
				expect(handleChange).toHaveBeenCalledWith({index: 2, type: 'onChange'});
			});
			await waitFor(() => {
				const actual = handleNextClick.mock.calls.length && handleNextClick.mock.calls[0][0];

				expect(actual).toMatchObject(expected);
			});
		}
	);

	test(
		'should fire `onPrevClick` and `onChange` with type when go to the previous page',
		async () => {
			const handleChange = jest.fn();
			const handlePrevClick = jest.fn();
			const user = userEvent.setup();

			render(
				<PageViews index={2} onChange={handleChange} onPrevClick={handlePrevClick}>
					<Page />
					<Page />
					<Page />
				</PageViews>
			);

			const prevButton = screen.getByLabelText('Previous');
			const expected = {type: 'onPrevClick'};

			await user.click(prevButton);

			await waitFor(() => {
				expect(handleChange).toHaveBeenCalledWith({index: 1, type: 'onChange'});
			});
			await waitFor(() => {
				const actual = handlePrevClick.mock.calls.length && handlePrevClick.mock.calls[0][0];

				expect(actual).toMatchObject(expected);
			});
		}
	);

	test ('should render accept `fullContents` prop', () => {
		render(
			<PageViews fullContents pageIndicatorType="number" index={1}>
				<Page>I got contents</Page>
				<Page>I got contents</Page>
			</PageViews>
		);

		const panel = screen.getByRole('region');
		const expected = 'fullContents';

		expect(panel).toHaveClass(expected);
	});

	test (
		'should navigate on Page Indicator click when `bannerMode` is true',
		async () => {
			const handleChange = jest.fn();
			const handleStepsClick = jest.fn();
			const user = userEvent.setup();

			render(
				<PageViews bannerMode index={2} onChange={handleChange} onStepsClick={handleStepsClick}>
					<Page />
					<Page />
					<Page />
				</PageViews>
			);

			const indicatorDot = screen.getByRole('list').children[1];
			const expected = {type: 'onStepsClick'};

			await user.click(indicatorDot);

			await waitFor(() => {
				expect(handleChange).toHaveBeenCalledWith({index: 1, type: 'onChange'});
			});
			await waitFor(() => {
				const actual = handleStepsClick.mock.calls.length && handleStepsClick.mock.calls[0][0];

				expect(actual).toMatchObject(expected);
			});
		}
	);
	test (
		'should navigate via 5-way left key when `bannerMode` is true',
		async () => {
			const handleChange = jest.fn();
			const user = userEvent.setup();

			render(
				<PageViews bannerMode index={1} onChange={handleChange}>
					<Page />
					<Page />
					<Page />
				</PageViews>
			);
			const pageViews = screen.getByRole('region').children[0];

			await fireEvent.keyDown(pageViews, {which: 37, keyCode: 37, code: 37});

			await waitFor(() => {
				expect(handleChange).toHaveBeenCalledWith({index: 0, type: 'onChange'});
			});
		}
	);
	test (
		'should navigate via 5-way right key when `bannerMode` is true',
		async () => {
			const handleChange = jest.fn();
			const user = userEvent.setup();

			render(
				<PageViews bannerMode index={1} onChange={handleChange}>
					<Page />
					<Page />
					<Page />
				</PageViews>
			);
			const pageViews = screen.getByRole('region').children[0];

			await fireEvent.keyDown(pageViews, {which: 39, keyCode: 39, code: 39});

			await waitFor(() => {
				expect(handleChange).toHaveBeenCalledWith({index: 2, type: 'onChange'});
			});
		}
	);
});
