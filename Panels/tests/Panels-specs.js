import {getContainerConfig} from '@enact/spotlight/src/container';
import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '../../Button';
import Header from '../Header';
import Panel, {PanelBase} from '../Panel';
import Panels from '../Panels';

describe('Panels Specs', () => {
	test('should set {autoFocus} on child to "default-element" on first render', () => {
		const DivPanel = ({autoFocus, id}) => <div data-testid="panel" id={id}>{autoFocus}</div>;
		render(
			<Panels index={0}>
				<DivPanel />
			</Panels>
		);

		const expected = 'default-element';
		const actual = screen.getByTestId('panel').textContent;

		expect(actual).toBe(expected);
	});

	test('should set {autoFocus} on child to "default-element" when navigating to a higher index', () => {
		const DivPanel = ({autoFocus, id}) => <div data-testid="panel" id={id}>{autoFocus}</div>;
		const {rerender} = render(
			<Panels index={0}>
				<DivPanel />
				<DivPanel id="p2" />
			</Panels>
		);

		rerender(
			<Panels index={1}>
				<DivPanel />
				<DivPanel id="p2" />
			</Panels>
		);

		const expected = 'default-element';
		const actual = screen.getAllByTestId('panel')[0].textContent;

		expect(actual).toBe(expected);
	});

	test('should not set {autoFocus} on child when navigating to a higher index when it has an autoFocus prop set', () => {
		const DivPanel = ({autoFocus, id}) => <div data-testid="panel" id={id}>{autoFocus}</div>;
		const {rerender} = render(
			<Panels index={0}>
				<DivPanel />
				<DivPanel id="p2" autoFocus="last-focused" />
			</Panels>
		);

		rerender(
			<Panels index={1}>
				<DivPanel />
				<DivPanel id="p2" autoFocus="last-focused" />
			</Panels>
		);

		const expected = 'last-focused';
		const panel = screen.getAllByTestId('panel')[0];

		expect(panel.textContent).toBe(expected);
		expect(panel.id).toBe('p2');
	});

	test('should return a ref to the root Panel node', () => {
		const ref = jest.fn();
		render(<Panel ref={ref} />);

		const expected = 'ARTICLE';
		const actual = ref.mock.calls[0][0].nodeName;

		expect(actual).toBe(expected);
	});

	describe('with Panel and Header', () => {
		test('should not render back button on the first panel', () => {
			render(
				<Panels index={0}>
					<Panel>
						<Header />
					</Panel>
				</Panels>
			);

			const backButton = screen.queryByLabelText('go to previous');

			expect(backButton).toBeNull();
		});

		test('should render back button when not on the first panel', () => {
			render(
				<Panels index={1}>
					<Panel>
						<Header />
					</Panel>
					<Panel>
						<Header />
					</Panel>
				</Panels>
			);

			const backButton = screen.getByLabelText('go to previous');

			expect(backButton).toBeInTheDocument();
		});

		test('should fire `onBack` with `onBack` type when back clicked', async () => {
			const handleBack = jest.fn();
			const user = userEvent.setup();

			render(
				<Panels index={1} onBack={handleBack}>
					<Panel>
						<Header />
					</Panel>
					<Panel>
						<Header />
					</Panel>
				</Panels>
			);

			await user.click(screen.getByLabelText('go to previous'));

			const expected = {type: 'onBack'};

			await waitFor(() => {
				const actual = handleBack.mock.calls.length && handleBack.mock.calls[0][0];

				expect(actual).toMatchObject(expected);
			});
		});

		test('should not render back button when not on the first panel and \'noBackButton\' is set to true', () => {
			render(
				<Panels index={1} noBackButton>
					<Panel>
						<Header />
					</Panel>
					<Panel>
						<Header />
					</Panel>
				</Panels>
			);

			const backButton = screen.queryByLabelText('go to previous');

			expect(backButton).toBeNull();
		});

		test('should not render back button when \'noBackButton\' is set on `Panel` 2', () => {
			render(
				<Panels index={1}>
					<Panel>
						<Header />
					</Panel>
					<Panel noBackButton>
						<Header />
					</Panel>
				</Panels>
			);

			const backButton = screen.queryByLabelText('go to previous');

			expect(backButton).toBeNull();
		});

		test('should render back button on panel 3 when \'noBackButton\' is set on panel 2', () => {
			render(
				<Panels index={2}>
					<Panel>
						<Header />
					</Panel>
					<Panel noBackButton>
						<Header />
					</Panel>
					<Panel>
						<Header />
					</Panel>
				</Panels>
			);

			const backButton = screen.getByLabelText('go to previous');

			expect(backButton).toBeInTheDocument();
		});

		test('should set back button "aria-label" to backButtonAriaLabel', () => {
			const label = 'custom back button label';
			render(
				<Panels backButtonAriaLabel={label} index={1}>
					<Panel>
						<Header />
					</Panel>
					<Panel>
						<Header />
					</Panel>
				</Panels>
			);

			const backButton = screen.getByLabelText(label);
			const backButtonContainer = backButton.parentElement.parentElement;
			const expectedClass = 'slotBefore';

			expect(backButton).toBeInTheDocument();
			expect(backButtonContainer).toHaveClass(expectedClass);
		});

		test('should set back button "aria-label" to backButtonAriaLabel when defined only on a panel', () => {
			const label = 'custom back button label';
			render(
				<Panels index={1}>
					<Panel>
						<Header />
					</Panel>
					<Panel backButtonAriaLabel={label}>
						<Header />
					</Panel>
				</Panels>
			);

			const backButton = screen.getByLabelText(label);
			const backButtonContainer = backButton.parentElement.parentElement;
			const expectedClass = 'slotBefore';

			expect(backButton).toBeInTheDocument();
			expect(backButtonContainer).toHaveClass(expectedClass);
		});

		test('should render close button', () => {
			render(
				<Panels index={0}>
					<Panel>
						<Header />
					</Panel>
				</Panels>
			);

			const closeButton = screen.getByLabelText('Exit app');
			const closeButtonContainer = closeButton.parentElement.parentElement;
			const expectedClass = 'slotAfter';

			expect(closeButton).toBeInTheDocument();
			expect(closeButtonContainer).toHaveClass(expectedClass);
		});

		test('should not render close button when \'noCloseButton\' is set to true', () => {
			render(
				<Panels index={0} noCloseButton>
					<Panel>
						<Header />
					</Panel>
				</Panels>
			);

			const closeButton = screen.queryByLabelText('Exit app');

			expect(closeButton).toBeNull();
		});

		test('should set close button "aria-label" to closeButtonAriaLabel', () => {
			const label = 'custom close button label';
			render(
				<Panels closeButtonAriaLabel={label} index={0}>
					<Panel>
						<Header />
					</Panel>
				</Panels>
			);

			const closeButton = screen.getByLabelText(label);
			const closeButtonContainer = closeButton.parentElement.parentElement;
			const expectedClass = 'slotAfter';

			expect(closeButton).toBeInTheDocument();
			expect(closeButtonContainer).toHaveClass(expectedClass);
		});
	});
});

describe('Panel Specs', () => {
	// Header components receive `titleId` and `subtitleId`, so do not pass them to the DOM
	const WizardHeader = () => <div>Wizard header</div>;

	test('should label a wizard panel by its header container', () => {
		render(<PanelBase data-testid="panel" panelType="wizard" header={<WizardHeader />} />);

		const panel = screen.getByTestId('panel');
		const headerContainer = screen.getByText('Wizard header').parentElement;

		expect(headerContainer.id).toMatch(/^panel_[0-9]+_header$/);
		expect(panel).toHaveAttribute('aria-labelledby', headerContainer.id);
	});

	test('should not label a wizard panel by its header when `aria-label` is set', () => {
		render(<PanelBase aria-label="Custom" data-testid="panel" panelType="wizard" header={<WizardHeader />} />);

		const panel = screen.getByTestId('panel');
		const headerContainer = screen.getByText('Wizard header').parentElement;

		expect(panel).not.toHaveAttribute('aria-labelledby');
		expect(headerContainer).not.toHaveAttribute('id');
	});

	describe('last focused element persistence', () => {
		const renderPanel = () => render(
			<Panel spotlightId="persistPanel">
				<Button data-spotlight-ignore-restore>Ignored</Button>
				<Button>First</Button>
				<Button>Second</Button>
			</Panel>
		);

		test('should restore the last focused element by its position among elements that are not ignored', () => {
			renderPanel();
			const {lastFocusedPersist, lastFocusedRestore} = getContainerConfig('persistPanel');
			const [ignored, first, second] = screen.getAllByRole('button');

			const key = lastFocusedPersist(second, [ignored, first, second]);

			// Once the ignored element is gone, a plain index would point past the last element
			const expected = second;
			const actual = lastFocusedRestore(key, [first, second]);

			expect(key).toEqual({container: false, element: true, key: 1});
			expect(actual).toBe(expected);
		});

		test('should restore a last focused sub-container by its id', () => {
			renderPanel();
			const {lastFocusedPersist, lastFocusedRestore} = getContainerConfig('persistPanel');

			const key = lastFocusedPersist('subContainer', screen.getAllByRole('button'));

			expect(key).toEqual({container: true, element: false, key: 'subContainer'});
			expect(lastFocusedRestore(key, [])).toBe('subContainer');
		});
	});
});
