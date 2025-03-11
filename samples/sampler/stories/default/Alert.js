import Alert, {AlertBase, AlertImage} from '@enact/limestone/Alert';
import Scroller from '@enact/limestone/Scroller';
import Button from '@enact/limestone/Button';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';

import {svgGenerator} from '../helper/svg';

import css from './Alert.module.less';

Alert.displayName = 'Alert';
AlertImage.displayName = 'AlertImage';
const Config = mergeComponentMetadata('Alert', AlertBase, Alert);
const ImageConfig = mergeComponentMetadata('AlertImage', AlertImage);

const prop = {
	buttons: {
		'no buttons': null,
		'1 button': (
			<buttons>
				<Button>Button Label</Button>
			</buttons>
		),
		'2 buttons': (
			<buttons>
				<Button>Button Label</Button>
				<Button>Button Label</Button>
			</buttons>
		),
		'3 buttons': (
			<buttons>
				<Button>Button Label</Button>
				<Button>Button Label</Button>
				<Button>Button Label</Button>
			</buttons>
		)
	}
};

export default {
	title: 'Limestone/Alert',
	component: 'Alert'
};

export const _Alert = (args) => (
	<Alert
		open={args['open']}
		onClose={action('onClose')}
		overlayAlertPosition={args['overlayAlertPosition']}
		title={args['title']}
		type={args['type']}
	>
		{args['image'] ? (
			<image>
				<AlertImage iconSize={args['iconSize']} src={args['src']} type={args['type (image)']} />
			</image>
		) : null}
		{prop.buttons[args['buttons']]}
		<Scroller verticalScrollbar="visible" className={css.scroller} style={{height: ri.scaleToRem(900)}}>
			{args['children']}
		</Scroller>
	</Alert>
);

boolean('open', _Alert, Config);
select('buttons', _Alert, ['no buttons', '1 button', '2 buttons', '3 buttons'], Config, '2 buttons');
text('title', _Alert, Config, 'Fullscreen Alert Title');
select('type', _Alert, ['fullscreen', 'overlay'], Config);
select('overlayAlertPosition', _Alert, ['center', 'bottomLeft', 'bottomRight', 'topLeft', 'topRight'], Config);
text('children', _Alert, Config, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
boolean('image', _Alert, ImageConfig);
select('type (image)', _Alert, ['icon', 'thumbnail'], ImageConfig, 'icon');
select('iconSize', _Alert, ['small', 'large'], ImageConfig, 'large');
text('src', _Alert, ImageConfig, svgGenerator(240, 240, 'd8d8d8', '6e6e6e', 'image'));

_Alert.storyName = 'Alert';
_Alert.parameters = {
	info: {
		text: 'Basic usage of Alert'
	}
};
