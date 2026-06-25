import Alert, {AlertBase, AlertImage} from '@enact/limestone/Alert';
import Button from '@enact/limestone/Button';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';

import {svgGenerator} from '../helper/svg';

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
		),
		'4 buttons': (
			<buttons>
				<Button>Button Label</Button>
				<Button>Button Label</Button>
				<Button>Button Label</Button>
				<Button>Button Label</Button>
			</buttons>
		)
	},
	smallButtons: {
		'no buttons': null,
		'1 button': (
			<buttons>
				<Button size="small">Button Label</Button>
			</buttons>
		),
		'2 buttons': (
			<buttons>
				<Button size="small">Button Label</Button>
				<Button size="small">Button Label</Button>
			</buttons>
		),
		'3 buttons': (
			<buttons>
				<Button size="small">Button Label</Button>
				<Button size="small">Button Label</Button>
				<Button size="small">Button Label</Button>
			</buttons>
		),
		'4 buttons': (
			<buttons>
				<Button size="small">Button Label</Button>
				<Button size="small">Button Label</Button>
				<Button size="small">Button Label</Button>
				<Button size="small">Button Label</Button>
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
		buttonDirection={args['buttonDirection']}
		open={args['open']}
		onClose={action('onClose')}
		overlayPosition={args['overlayPosition']}
		size={args['size']}
		title={args['title']}
		type={args['type']}
	>
		{args['image'] ? (
			<image>
				<AlertImage iconSize={args['iconSize']} src={args['src']} type={args['type (image)']} />
			</image>
		) : null}
		{args['type'] === 'fullscreen' ? prop.buttons[args['buttons']] : prop.smallButtons[args['buttons']]}
		{args['children']}
	</Alert>
);

boolean('open', _Alert, Config);
select('buttons', _Alert, ['no buttons', '1 button', '2 buttons', '3 buttons', '4 buttons'], Config, '2 buttons');
select('buttonDirection', _Alert, ['auto', 'horizontal', 'vertical'], Config, 'auto');
select('size', _Alert, ['small', 'medium', 'large'], Config);
text('title', _Alert, Config, 'Fullscreen Alert Title');
select('type', _Alert, ['fullscreen', 'overlay'], Config);
select('overlayPosition', _Alert, ['bottom left', 'bottom right', 'center', 'top left', 'top right'], Config);
text('children', _Alert, Config, 'Additional text content for Alert');
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
