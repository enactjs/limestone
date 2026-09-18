import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';

import {CardSportsBase} from '../CardSports';

const src = {
	'hd': 'https://placehold.co/200x200/000000/ffffff/png',
	'fhd': 'https://placehold.co/300x300/000000/ffffff/png',
	'uhd': 'https://placehold.co/600x600/000000/ffffff/png'
};

describe('CardSports', () => {
	test('should apply `sports` class', () => {
		render(
			<CardSportsBase
				data-testid="card"
				leftTeam={{backgroundColor: '#1b2a4a', score: '1/0'}}
				rightTeam={{backgroundColor: '#e31c23', score: '0/2'}}
			/>
		);

		expect(screen.getByTestId('card')).toHaveClass('sports');
	});

	test('should render the composed team score without requiring `src`', () => {
		render(
			<CardSportsBase
				leftTeam={{backgroundColor: '#1b2a4a', score: '0/0'}}
				rightTeam={{backgroundColor: '#e31c23', score: '1/1'}}
			/>
		);

		expect(screen.getByText('0/0 : 1/1')).toBeInTheDocument();
	});

	test('should render team logos with the same badge implementation as `primaryBadge`', () => {
		render(
			<CardSportsBase
				leftTeam={{logo: 'Left Logo', score: '0/0'}}
				rightTeam={{logo: <div data-testid="right-team-logo" />, score: '0/0'}}
			/>
		);

		expect(screen.getByText('Left Logo')).toBeInTheDocument();
		expect(screen.getByTestId('right-team-logo')).toBeInTheDocument();
	});

	test('should not render `captionImageIconsSrc` when `captionOverlay` is true', () => {
		render(
			<CardSportsBase
				captionImageIconsSrc={[src]}
				captionOverlay
				leftTeam={{backgroundColor: '#1b2a4a', score: '0/0'}}
				rightTeam={{backgroundColor: '#e31c23', score: '0/0'}}
			>
				Title
			</CardSportsBase>
		);

		expect(screen.queryAllByRole('img')).toHaveLength(2);
	});

	test('should still render `imageOverlay` after the sports overlay', () => {
		render(
			<CardSportsBase
				imageOverlay={<div>Extra Overlay</div>}
				leftTeam={{backgroundColor: '#1b2a4a', score: '0/0'}}
				rightTeam={{backgroundColor: '#e31c23', score: '0/0'}}
			/>
		);

		expect(screen.getByText('Extra Overlay')).toBeInTheDocument();
		expect(screen.getByText('0/0 : 0/0')).toBeInTheDocument();
	});

	test('should still render `primaryBadge` and `secondaryBadge`', () => {
		render(
			<CardSportsBase
				leftTeam={{backgroundColor: '#1b2a4a', score: '0/0'}}
				primaryBadge="Primary Badge"
				rightTeam={{backgroundColor: '#e31c23', score: '0/0'}}
				secondaryBadge="Secondary Badge"
			/>
		);

		expect(screen.getByText('Primary Badge')).toBeInTheDocument();
		expect(screen.getByText('Secondary Badge')).toBeInTheDocument();
	});

	test('should render a single score when only one team has a score', () => {
		render(
			<CardSportsBase
				leftTeam={{backgroundColor: '#1b2a4a', score: '1/0'}}
				rightTeam={{backgroundColor: '#e31c23'}}
			/>
		);

		expect(screen.getByText('1/0')).toBeInTheDocument();
	});

	test('should not render a score pill when neither team has a score', () => {
		render(
			<CardSportsBase
				data-testid="card"
				leftTeam={{backgroundColor: '#1b2a4a'}}
				rightTeam={{backgroundColor: '#e31c23'}}
			/>
		);

		expect(screen.getByTestId('card')).toHaveClass('sports');
		expect(screen.queryByText(' : ', {exact: false})).not.toBeInTheDocument();
	});

	test('should not render `captionImageIconsSrc` when `captionOverlayOnFocus` is true', () => {
		render(
			<CardSportsBase
				captionImageIconsSrc={[src]}
				captionOverlayOnFocus
				leftTeam={{backgroundColor: '#1b2a4a', score: '0/0'}}
				rightTeam={{backgroundColor: '#e31c23', score: '0/0'}}
			>
				Title
			</CardSportsBase>
		);

		expect(screen.queryAllByRole('img')).toHaveLength(2);
	});
});
