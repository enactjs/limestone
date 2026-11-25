import DotSpinner, {DotSpinnerBase} from '@enact/limestone/DotSpinner';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';

DotSpinner.displayName = 'DotSpinner';
const Config = mergeComponentMetadata('DotSpinner', DotSpinnerBase, DotSpinner);

export default {
	title: 'Limestone/DotSpinner',
	component: 'DotSpinner'
};

export const _DotSpinner = (args) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			outline: 'teal dashed 1px',
			position: 'relative',
			padding: ri.scaleToRem(180),
			backgroundColor: 'rgba(0, 187, 187, 0.5)'
		}}
	>
		<DotSpinner
			paused={args['paused']}
			size={args['size']}
			transparent={args['transparent']}
		>
			{args['content']}
		</DotSpinner>
	</div>
);

boolean('paused', _DotSpinner, Config);
select('size', _DotSpinner, [null, 'medium', 'small'], Config);
boolean('transparent', _DotSpinner, Config);
text('content', _DotSpinner, Config, '');

_DotSpinner.storyName = 'DotSpinner';
_DotSpinner.parameters = {
	info: {
		text: 'Three-dot bouncing spinner for loading states'
	}
};
