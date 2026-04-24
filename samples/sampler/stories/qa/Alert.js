import Alert, {AlertBase, AlertImage} from '@enact/limestone/Alert';
import Button from '@enact/limestone/Button';
import CheckboxItem from '@enact/limestone/CheckboxItem';
import ProgressBar from '@enact/limestone/ProgressBar';
import Scroller from '@enact/limestone/Scroller';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';
import {Row} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';

import {svgGenerator} from '../helper/svg';

import css from './Alert.module.less';

Alert.displayName = 'Alert';
AlertImage.displayName = 'AlertImage';
const Config = mergeComponentMetadata('Alert', AlertBase, Alert);
const ImageConfig = mergeComponentMetadata('AlertImage', AlertImage);

const inputData = {
	longTitle:
	'Core, The building blocks of an Enact application. Limestone, our touch-centric UI library.',
	longChildren:
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat. In quis mattis purus, quis tristique mi. Mauris vitae tellus tempus, convallis ligula id, laoreet eros. Nullam eu tempus odio, non mollis tellus. Phasellus vitae iaculis nisl. Sed ipsum felis, suscipit vel est quis, interdum pretium dolor. Curabitur sit amet purus ac massa ullamcorper egestas ornare vel lectus. Nullam quis velit sed ex finibus cursus. Duis porttitor congue cursus.'
};

export default {
	title: 'Limestone/Alert',
	component: 'Alert'
};

const prop = {
	twoButtons:
	<buttons>
		<Button>Button Label</Button>
		<Button>Button Label</Button>
	</buttons>,
	twoSmallButtons:
	<buttons>
		<Button size="small">Button Label</Button>
		<Button size="small">Button Label</Button>
	</buttons>,
	threeButtons:
	<buttons>
		<Button>Button Label</Button>
		<Button>Button Label</Button>
		<Button>Button Label</Button>
	</buttons>,
	threeSmallButtons:
	<buttons>
		<Button size="small">Button Label</Button>
		<Button size="small">Button Label</Button>
		<Button size="small">Button Label</Button>
	</buttons>
};

export const WithLongTitle = (args) => (
	<Alert
		buttonDirection={args['buttonDirection']}
		open={args['open']}
		onClose={action('onClose')}
		title={args['title']}
		type={args['type']}
	>
		{args['image'] ? (
			<image>
				<AlertImage src={args['src']} type={args['type (image)']} />
			</image>
		) : null}
		{args['type'] === 'fullscreen' ? prop.twoButtons : prop.twoSmallButtons}
		{args['children']}
	</Alert>
);

boolean('open', WithLongTitle, Config);
text('title', WithLongTitle, Config, inputData.longTitle);
select('type', WithLongTitle, ['fullscreen', 'overlay'], Config);
select('buttonDirection', WithLongTitle, ['auto', 'horizontal', 'vertical'], Config, 'auto');
text('children', WithLongTitle, Config, 'Additional text content for Alert');
boolean('image', WithLongTitle, ImageConfig);
select('type (image)', WithLongTitle, ['icon', 'thumbnail'], ImageConfig, 'icon');
text('src', WithLongTitle, ImageConfig, svgGenerator(240, 240, 'd8d8d8', '6e6e6e', 'image'));

WithLongTitle.storyName = 'with long title';

export const WithLongChildren = (args) => (
	<Alert
		buttonDirection={args['buttonDirection']}
		open={args['open']}
		onClose={action('onClose')}
		title={args['title']}
		type={args['type']}
	>
		{args['image'] ? (
			<image>
				<AlertImage src={args['src']} type={args['type (image)']} />
			</image>
		) : null}
		{args['type'] === 'fullscreen' ? prop.twoButtons : prop.twoSmallButtons}
		{args['children']}
	</Alert>
);

boolean('open', WithLongChildren, Config);
text('title', WithLongChildren, Config, 'Fullscreen Alert Title');
select('type', WithLongChildren, ['fullscreen', 'overlay'], Config);
select('buttonDirection', WithLongChildren, ['auto', 'horizontal', 'vertical'], Config, 'auto');
text('children', WithLongChildren, Config, inputData.longChildren);
boolean('image', WithLongChildren, ImageConfig);
select('type (image)', WithLongChildren, ['icon', 'thumbnail'], ImageConfig, 'icon');
text('src', WithLongChildren, ImageConfig, svgGenerator(240, 240, 'd8d8d8', '6e6e6e', 'image'));

WithLongChildren.storyName = 'with long children';

export const WithLongTitleAndLongChildren = (args) => (
	<Alert
		buttonDirection={args['buttonDirection']}
		open={args['open']}
		onClose={action('onClose')}
		title={args['title']}
		type={args['type']}
	>
		{args['image'] ? (
			<image>
				<AlertImage src={args['src']} type={args['type (image)']} />
			</image>
		) : null}
		{args['type'] === 'fullscreen' ? prop.twoButtons : prop.twoSmallButtons}
		{args['children']}
	</Alert>
);

boolean('open', WithLongTitleAndLongChildren, Config);
text('title', WithLongTitleAndLongChildren, Config, inputData.longTitle);
select('type', WithLongTitleAndLongChildren, ['fullscreen', 'overlay'], Config);
select('buttonDirection', WithLongTitleAndLongChildren, ['auto', 'horizontal', 'vertical'], Config, 'auto');
text('children', WithLongTitleAndLongChildren, Config, inputData.longChildren);
boolean('image', WithLongTitleAndLongChildren, ImageConfig);
select('type (image)', WithLongTitleAndLongChildren, ['icon', 'thumbnail'], ImageConfig, 'icon');
text('src', WithLongTitleAndLongChildren, ImageConfig, svgGenerator(240, 240, 'd8d8d8', '6e6e6e', 'image'));

WithLongTitleAndLongChildren.storyName = 'with long title and long children';

export const WithDifferentTypesOfComponentsAndLongChildren = (args) => (
	<Alert
		buttonDirection={args['buttonDirection']}
		open={args['open']}
		onClose={action('onClose')}
		title={args['title']}
		type={args['type']}
	>
		{args['image'] ?
			<image>
				<AlertImage src={args['src']} type={args['type (image)']} />
			</image> : null
		}
		{args['type'] === 'fullscreen' ? prop.twoButtons : prop.twoSmallButtons}
		<div>
			<div>This is progressbar</div>
			<ProgressBar progress={0.5} />
		</div>
		<div>
			<CheckboxItem>This is CheckboxItem</CheckboxItem>
		</div>
		<Scroller style={{height: ri.scaleToRem(800)}}>
			<div style={{height: ri.scaleToRem(1600)}}>
				{args['children']}
			</div>
		</Scroller>
	</Alert>
);

boolean('open', WithDifferentTypesOfComponentsAndLongChildren, Config, true);
text('title', WithDifferentTypesOfComponentsAndLongChildren, Config, 'Overlay Alert Title');
select('type', WithDifferentTypesOfComponentsAndLongChildren, ['fullscreen', 'overlay'], Config, 'overlay');
select('buttonDirection', WithDifferentTypesOfComponentsAndLongChildren, ['auto', 'horizontal', 'vertical'], Config, 'auto');
text('children', WithDifferentTypesOfComponentsAndLongChildren, Config, inputData.longChildren);
boolean('image', WithDifferentTypesOfComponentsAndLongChildren, ImageConfig);
select('type (image)', WithDifferentTypesOfComponentsAndLongChildren, ['icon', 'thumbnail'], ImageConfig, 'icon');
text('src', WithDifferentTypesOfComponentsAndLongChildren, ImageConfig, svgGenerator(240, 240, 'd8d8d8', '6e6e6e', 'image'));

WithDifferentTypesOfComponentsAndLongChildren.storyName = 'with different types of components and long children';

export const WithThumbnailAndScroller = (args) => (
	<Alert
		buttonDirection={args['buttonDirection']}
		css={css}
		open={args['open']}
		onClose={action('onClose')}
		title={args['title']}
		type={args['type']}
	>
		<image>
			<AlertImage src={args['src']} type={args['type (image)']} />
		</image>
		{args['type'] === 'fullscreen' ? prop.threeButtons : prop.threeSmallButtons}
		<Row>
			<AlertImage iconSize="small" src={args['src']} type="icon" />
			<Scroller className={css.scroller}>
				<div style={{height: ri.scaleToRem(1600)}}>
					{args['children']}
				</div>
			</Scroller>
		</Row>
	</Alert>
);

boolean('open', WithThumbnailAndScroller, Config, true);
text('title', WithThumbnailAndScroller, Config, 'Overlay Alert Title');
select('type', WithThumbnailAndScroller, ['fullscreen', 'overlay'], Config, 'overlay');
select('buttonDirection', WithThumbnailAndScroller, ['auto', 'horizontal', 'vertical'], Config, 'auto');
text('children', WithThumbnailAndScroller, Config, inputData.longChildren);
select('type (image)', WithThumbnailAndScroller, ['icon', 'thumbnail'], ImageConfig, 'thumbnail');
text('src', WithThumbnailAndScroller, ImageConfig, svgGenerator(240, 240, 'd8d8d8', '6e6e6e', 'image'));

WithThumbnailAndScroller.storyName = 'with thumbnail and scroller';

export const WithCustomSizeImage = (args) => (
	<Alert
		buttonDirection={args['buttonDirection']}
		open={args['open']}
		onClose={action('onClose')}
		title="Fullscreen Alert Title"
		type={args['type']}
	>
		<image>
			<AlertImage src={args['src']} type="thumbnail" css={css} />
		</image>
		{args['type'] === 'fullscreen' ? prop.twoButtons : prop.twoSmallButtons}
		Additional text content for Alert
	</Alert>
);

boolean('open', WithCustomSizeImage, Config);
select('buttonDirection', WithCustomSizeImage, ['auto', 'horizontal', 'vertical'], Config, 'auto');
text('src', WithCustomSizeImage, ImageConfig, svgGenerator(240, 240, 'd8d8d8', '6e6e6e', 'image'));

WithCustomSizeImage.storyName = 'with custom size image';
