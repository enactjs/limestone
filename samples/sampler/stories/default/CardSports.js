import {Card, CardBase} from '@enact/limestone/Card';
import CardSports, {CardSportsBase} from '@enact/limestone/CardSports';
import icons from '@enact/limestone/Icon/IconList';
import {Icon} from '@enact/limestone/Icon';
import {Image} from '@enact/limestone/Image';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, object, select, text} from '@enact/storybook-utils/addons/controls';
import {Card as UiCard} from '@enact/ui/Card';

import {svgGenerator} from '../helper/svg';

const Config = mergeComponentMetadata('CardSports', UiCard, CardBase, Card, CardSportsBase, CardSports);
CardSports.displayName = 'CardSports';

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
	title: 'Limestone/CardSports',
	component: 'CardSports'
};

export const _CardSports = (args) => {
	const captionImageIconsSrc = args['captionImageIconsSrc'];
	const leftTeam = args['leftTeam'] || defaultLeftTeam;
	const rightTeam = args['rightTeam'] || defaultRightTeam;

	const controls = {
		captionImageIconsSrc: [captionImageIconsSrc, captionImageIconsSrc, captionImageIconsSrc, captionImageIconsSrc],
		captionOverflow: args['captionOverflow'],
		captionOverflowOnFocus: args['captionOverflowOnFocus'],
		captionOverlay: args['captionOverlay'],
		captionOverlayOnFocus: args['captionOverlayOnFocus'],
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
		<CardSports
			{...controls}
			onClick={action('onClick')}
		>
			{args['children']}
		</CardSports>
	);
};

object('captionImageIconsSrc', _CardSports, Config, defaultCaptionImageIconsSrc);
boolean('captionOverflow', _CardSports, Config);
boolean('captionOverflowOnFocus', _CardSports, Config);
boolean('captionOverlay', _CardSports, Config);
boolean('captionOverlayOnFocus', _CardSports, Config);
text('children', _CardSports, Config, 'Item Label');
boolean('disabled', _CardSports, Config);
boolean('hasContainer', _CardSports, Config, true);
text('label', _CardSports, Config, 'Description Label');
object('leftTeam', _CardSports, Config, defaultLeftTeam);
select('leftTeamLogo', _CardSports, ['image', 'icon', 'text'], Config, 'image');
select('primaryBadge', _CardSports, ['image', 'icon', 'text'], Config, 'icon');
object('rightTeam', _CardSports, Config, defaultRightTeam);
select('rightTeamLogo', _CardSports, ['image', 'icon', 'text'], Config, 'image');
boolean('roundedImage', _CardSports, Config, true);
select('secondaryBadge', _CardSports, ['image', 'icon', 'text'], Config, 'icon');
boolean('selected', _CardSports, Config);

_CardSports.storyName = 'CardSports';
_CardSports.parameters = {
	info: {
		text: 'The sports Card'
	}
};
