import ri from '@enact/ui/resolution';
import Spinner from '../../../../Spinner';

const spinnerWrapper = (children) => (
	<div
		style={{
			outline: 'teal dashed 1px',
			position: 'relative',
			padding: ri.unit(90, 'rem'),
			backgroundColor: 'rgba(0, 187, 187, 0.5)'
		}}
	>
		<div
			style={{
				outline: 'teal dashed 1px',
				position: 'relative',
				height: ri.unit(180, 'rem')
			}}
		>
			{children}
		</div>
	</div>
);

const spinnerSmokeTests = [
	spinnerWrapper(<Spinner />)
];

const spinnerExtendedTests = [
	spinnerWrapper(<Spinner centered />),
	spinnerWrapper(<Spinner size="small" />),
	spinnerWrapper(<Spinner>Loading content</Spinner>),
	spinnerWrapper(<Spinner transparent />),
	spinnerWrapper(<Spinner paused>Loading content</Spinner>)
];

const SpinnerTests = [
	...spinnerSmokeTests,
	...spinnerExtendedTests
];

export default SpinnerTests;
