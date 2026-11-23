import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import {scaleToRem} from '@enact/ui/resolution';
import '@testing-library/jest-dom';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';

import Button from '../../Button';

import TooltipDecorator from '../TooltipDecorator';
import TooltipLabel from '../TooltipLabel';

const FloatingLayerController = FloatingLayerDecorator('div');
const TooltipButton = TooltipDecorator(Button);

const src = {
	hd: 'https://placehold.co/200x200',
	fhd: 'https://placehold.co/300x300',
	uhd: 'https://placehold.co/600x600'
};

describe('TooltipDecorator', () => {
	describe('TooltipLabel', () => {
		test('should apply alignment when `centered` and `marquee`', () => {
			render(<TooltipLabel centered marquee>Label</TooltipLabel>);

			const expected = 'center';
			const tooltip = screen.getByText('Label');

			expect(tooltip).toHaveStyle({'text-align': expected});
		});

		test('should not apply alignment when `centered` but not `marquee`', () => {
			render(<TooltipLabel centered>Label</TooltipLabel>);

			const unexpected = 'center';
			const tooltip = screen.getByText('Label');

			expect(tooltip).not.toHaveStyle({'text-align': unexpected});
		});

		test('should render the image before the text label by default', () => {
			render(<TooltipLabel tooltipImage={src.hd}>Label</TooltipLabel>);

			const expected = 'IMG';
			const tooltip = screen.getByText('Label');

			expect(tooltip.children[0].children[0].tagName).toBe(expected);
		});

		test('should apply `imageBelow` class when `tooltipImagePosition` is `below`', () => {
			render(<TooltipLabel tooltipImage={src.hd} tooltipImagePosition="below">Label</TooltipLabel>);

			const expected = 'imageBelow';
			const tooltip = screen.getByText('Label');

			expect(tooltip).toHaveClass(expected);
		});

		test('should not apply `imageBelow` class by default', () => {
			render(<TooltipLabel tooltipImage={src.hd}>Label</TooltipLabel>);

			const unexpected = 'imageBelow';
			const tooltip = screen.getByText('Label');

			expect(tooltip).not.toHaveClass(unexpected);
		});

		test('should wrap at a numeric `width` converted to rem', () => {
			render(<TooltipLabel width={300}>Label</TooltipLabel>);

			const tooltip = screen.getByText('Label');

			expect(tooltip).toHaveClass('multi');
			expect(tooltip.style.getPropertyValue('--lime-tooltip-label-width')).toBe(scaleToRem(300));
		});

		test('should use a string `width` as it is', () => {
			render(<TooltipLabel width="50%">Label</TooltipLabel>);

			expect(screen.getByText('Label').style.getPropertyValue('--lime-tooltip-label-width')).toBe('50%');
		});

		test('should size the label and the image from `tooltipImageSize`', () => {
			render(<TooltipLabel tooltipImage={src.hd} tooltipImageSize={{width: 200, height: 100}} width={300}>Label</TooltipLabel>);

			const tooltip = screen.getByText('Label');

			expect(tooltip.style.getPropertyValue('--lime-tooltip-label-width')).toBe(scaleToRem(200));
			expect(tooltip.style.getPropertyValue('--lime-tooltip-image-width')).toBe(scaleToRem(200));
			expect(tooltip.style.getPropertyValue('--lime-tooltip-image-height')).toBe(scaleToRem(100));
		});

		test('should render right-to-left text in RTL direction', () => {
			render(<TooltipLabel>{'שלום'}</TooltipLabel>);

			expect(screen.getByText('שלום')).toHaveStyle({direction: 'rtl'});
		});

		test('should not render an image without `tooltipImage`', () => {
			render(<TooltipLabel>Label</TooltipLabel>);

			const tooltip = screen.getByText('Label');
			expect(tooltip.querySelector('img')).toBeNull();
		});
	});

	describe('TooltipDecorator', () => {
		beforeEach(() => {
			global.Element.prototype.getBoundingClientRect = jest.fn(() => {
				return {
					width: 501,
					height: 501,
					top: 99,
					left: 99,
					bottom: 0,
					right: 0
				};
			});
		});

		test('should render a tooltip if hovered', async () => {
			const tooltipText = 'Tooltip';
			render(
				<FloatingLayerController>
					<TooltipButton tooltipDelay={0} tooltipText={tooltipText}>Label</TooltipButton>
				</FloatingLayerController>
			);

			const button = screen.getByRole('button');
			act(() => button.focus());
			fireEvent.mouseOver(button);

			await waitFor(() => {
				expect(screen.getByText('Tooltip')).toBeInTheDocument();
			});
		});

		test('should hide tooltip if not hovered', async () => {
			const tooltipText = 'Tooltip';
			render(
				<FloatingLayerController>
					<TooltipButton tooltipDelay={0} tooltipText={tooltipText}>Label</TooltipButton>
				</FloatingLayerController>
			);

			const button = screen.getByRole('button');
			act(() => button.focus());
			fireEvent.mouseOver(button);

			await waitFor(() => {
				expect(screen.getByText('Tooltip')).toBeInTheDocument();
			});

			act(() => button.blur());
			fireEvent.mouseOut(button);

			await waitFor(() => {
				expect(screen.queryByText('Tooltip')).not.toBeInTheDocument();
			});
		});

		test('should render a tooltip if hovered for \'tooltipRelative\'', async () => {
			console.error = jest.fn();	// eslint-disable-line no-console
			const tooltipText = 'Tooltip';
			render(
				<FloatingLayerController>
					<TooltipButton tooltipDelay={0} tooltipRelative tooltipText={tooltipText}>Label</TooltipButton>
				</FloatingLayerController>
			);

			const button = screen.getByRole('button');
			act(() => button.focus());
			fireEvent.mouseOver(button);

			await waitFor(() => {
				expect(screen.getByText('Tooltip')).toBeInTheDocument();
			});
		});

		describe('Tooltip position', () => {
			test('should have \'above\' className when tooltipPosition is set to \'above\'', async () => {
				const tooltipText = 'Tooltip';
				render(
					<FloatingLayerController>
						<TooltipButton tooltipDelay={0} tooltipPosition="above" tooltipText={tooltipText}>Label</TooltipButton>
					</FloatingLayerController>
				);

				const button = screen.getByRole('button');

				button.getBoundingClientRect = jest.fn(() => {
					return {
						width: 300,
						height: 300,
						top: 600,
						left: 600,
						bottom: 0,
						right: 0
					};
				});

				act(() => button.focus());
				fireEvent.mouseOver(button);

				await waitFor(() => {
					const tooltipArrow = screen.getByText('Tooltip').parentElement.parentElement;
					const expected = 'tooltip above';

					expect(tooltipArrow).toHaveClass(expected);
				});
			});

			test('should have \'below\' className when tooltipPosition is set to \'below\'', async () => {
				const tooltipText = 'Tooltip';
				render(
					<FloatingLayerController>
						<TooltipButton tooltipDelay={0} tooltipPosition="below" tooltipText={tooltipText}>Label</TooltipButton>
					</FloatingLayerController>
				);

				const button = screen.getByRole('button');

				button.getBoundingClientRect = jest.fn(() => {
					return {
						width: 300,
						height: 300,
						top: 600,
						left: 600,
						bottom: 0,
						right: 0
					};
				});

				act(() => button.focus());
				fireEvent.mouseOver(button);

				await waitFor(() => {
					const tooltipArrow = screen.getByText('Tooltip').parentElement.parentElement;

					const expected = 'tooltip below';

					expect(tooltipArrow).toHaveClass(expected);
				});
			});

			test('should have \'left middle\' className when tooltipPosition is set to \'left middle\'', async () => {
				const tooltipText = 'Tooltip';
				render(
					<FloatingLayerController>
						<TooltipButton tooltipDelay={0} tooltipPosition="left middle" tooltipText={tooltipText}>Label</TooltipButton>
					</FloatingLayerController>
				);

				const button = screen.getByRole('button');
				act(() => button.focus());
				fireEvent.mouseOver(button);

				await waitFor(() => {
					const tooltipArrow = screen.getByText('Tooltip').parentElement.parentElement;
					const expected = 'tooltip left middleArrow';

					expect(tooltipArrow).toHaveClass(expected);
				});
			});

			test('should have \'right middle\' className when tooltipPosition is set to \'right middle\'', async () => {
				const tooltipText = 'Tooltip';
				render(
					<FloatingLayerController>
						<TooltipButton tooltipDelay={0} tooltipPosition="right middle" tooltipText={tooltipText}>Label</TooltipButton>
					</FloatingLayerController>
				);

				const button = screen.getByRole('button');
				act(() => button.focus());
				fireEvent.mouseOver(button);

				await waitFor(() => {
					const tooltipArrow = screen.getByText('Tooltip').parentElement.parentElement;
					const expected = 'tooltip right middleArrow';

					expect(tooltipArrow).toHaveClass(expected);
				});
			});

			test('should have \'noArrow\' className when the prop is given', async () => {
				const tooltipText = 'Tooltip';
				render(
					<FloatingLayerController>
						<TooltipButton tooltipDelay={0} noArrow tooltipText={tooltipText}>Label</TooltipButton>
					</FloatingLayerController>
				);

				const button = screen.getByRole('button');
				act(() => button.focus());
				fireEvent.mouseOver(button);

				await waitFor(() => {
					const tooltipNoArrow = screen.getByText('Tooltip').parentElement.parentElement;
					const expected = 'tooltip noArrow';

					expect(tooltipNoArrow).toHaveClass(expected);
				});
			});

			test('should have properly display Image', async () => {
				const tooltipText = 'Tooltip';
				render(
					<FloatingLayerController>
						<TooltipButton tooltipDelay={0} tooltipImage={src} tooltipText={tooltipText}>Label</TooltipButton>
					</FloatingLayerController>
				);

				const button = screen.getByRole('button');
				act(() => button.focus());
				fireEvent.mouseOver(button);

				await waitFor(() => {
					const tooltipImage = screen.getByText('Tooltip').children[0].children[0].tagName;

					expect(tooltipImage).toBe('IMG');
				});
			});
		});
	});
});
