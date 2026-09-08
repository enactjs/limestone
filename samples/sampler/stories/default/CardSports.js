import {Card, CardBase} from '@enact/limestone/Card';
import icons from '@enact/limestone/Icon/IconList';
import {Icon} from '@enact/limestone/Icon';
import {Image} from '@enact/limestone/Image';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, object, select, text} from '@enact/storybook-utils/addons/controls';
import {Card as UiCard} from '@enact/ui/Card';

import {svgGenerator} from '../helper/svg';

const Config = mergeComponentMetadata('Card', UiCard, CardBase, Card);
Card.displayName = 'Card';

const generateImageSrc = (color) => {
	return {
		hd: svgGenerator(200, 200, color, 'ffffff', '200 X 200'),
		fhd: svgGenerator(300, 300, color, 'ffffff', '300 X 300'),
		uhd: svgGenerator(600, 600, color, 'ffffff', '600 X 600')
	};
};

const iconsList = Object.keys(icons).sort();
const randomIcon = () => iconsList[Math.floor(Math.random() * iconsList.length)];

const prop = {
	badges: {
		'image': <Image src={generateImageSrc('ff6d78')} />,
		'icon': <Icon>{randomIcon()}</Icon>,
		'text': 'Text'
	}
};

const defaultLeftTeam = {
	backgroundColor: '#1b2a4a',
	score: '0/0'
};

const defaultRightTeam = {
	backgroundColor: '#e31c23',
	score: '0/0'
};

const defaultCaptionImageIconsSrc = generateImageSrc('0084ff');

export default {
	title: 'Limestone/Card',
	component: 'Card'
};

export const _Sports = (args) => {
	const captionImageIconsSrc = args['captionImageIconsSrc'];
	const leftTeam = args['leftTeam'] || defaultLeftTeam;
	const rightTeam = args['rightTeam'] || defaultRightTeam;

	const controls = {
		captionImageIconsSrc: [captionImageIconsSrc, captionImageIconsSrc, captionImageIconsSrc, captionImageIconsSrc],
		disabled: args['disabled'],
		hasContainer: args['hasContainer'],
		// eslint-disable-next-line no-undefined
		label: args['label'] ? args['label'] : undefined,
		leftTeam: {
			...leftTeam,
			logo: prop.badges[args['leftTeamLogo']]
		},
		primaryBadge: prop.badges[args['primaryBadge']],
		rightTeam: {
			...rightTeam,
			logo: prop.badges[args['rightTeamLogo']]
		},
		roundedImage: args['roundedImage'],
		secondaryBadge: prop.badges[args['secondaryBadge']],
		selected: args['selected']
	};

	return (
		<Card
			{...controls}
			onClick={action('onClick')}
		>
			{args['children']}
		</Card>
	);
};

object('captionImageIconsSrc', _Sports, Config, defaultCaptionImageIconsSrc);
text('children', _Sports, Config, 'Item Label');
boolean('disabled', _Sports, Config);
boolean('hasContainer', _Sports, Config, true);
text('label', _Sports, Config, 'Description Label');
object('leftTeam', _Sports, Config, defaultLeftTeam);
select('leftTeamLogo', _Sports, ['image', 'icon', 'text'], Config, 'image');
select('primaryBadge', _Sports, ['image', 'icon', 'text'], Config, 'icon');
object('rightTeam', _Sports, Config, defaultRightTeam);
select('rightTeamLogo', _Sports, ['image', 'icon', 'text'], Config, 'image');
boolean('roundedImage', _Sports, Config, true);
select('secondaryBadge', _Sports, ['image', 'icon', 'text'], Config, 'icon');
boolean('selected', _Sports, Config);

_Sports.storyName = 'Sports';
_Sports.parameters = {
	info: {
		text: 'The sports Card'
	}
};
