import {Card, CardBase} from '@enact/limestone/Card';
import VirtualGridList from '@enact/limestone/VirtualList';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {number, object, select} from '@enact/storybook-utils/addons/controls';
import {Card as UiCard} from '@enact/ui/Card';
import ri from '@enact/ui/resolution';

import {svgGenerator} from '../helper/svg';

Card.displayName = 'Card';
const Config = mergeComponentMetadata('Card', UiCard, CardBase, Card);

const defaultDataSize = 100;

const items = [];

const renderItem = ({index, ...rest}) => {
	const {children, label, source} = items[index];

	return (
		<Card {...rest} label={label} src={source} style={{padding: '24px'}}>
			{children}
		</Card>
	);
};

const updateDataSize = (dataSize) => {
	const itemNumberDigits = dataSize > 0 ? (dataSize - 1 + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		const count = (headingZeros + i).slice(-itemNumberDigits),
			children = `Card ${count}`,
			label = `Card label ${count}`,
			color = Math.floor(Math.random() * (0x1000000 - 0x101010) + 0x101010).toString(16),
			source = {
				hd: svgGenerator(200, 200, color, 'ffffff', `Image ${i}`),
				fhd: svgGenerator(300, 300, color, 'ffffff', `Image ${i}`),
				uhd: svgGenerator(600, 600, color, 'ffffff', `Image ${i}`)
			};

		items.push({children, label, source});
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

const src = {
	hd: svgGenerator(200, 200, '0084ff', 'ffffff', '200 X 200'),
	fhd: svgGenerator(300, 300, '0084ff', 'ffffff', '300 X 300'),
	uhd: svgGenerator(600, 600, '0084ff', 'ffffff', '600 X 600')
};

const prop = {
	direction: ['horizontal', 'vertical']
};

export default {
	title: 'Limestone/Card',
	component: 'Card'
};

export const WithAsyncRender = (args) => (
	<VirtualGridList
		dataSize={updateDataSize(args['dataSize'])}
		direction={args['direction']}
		itemSize={{minHeight: ri.scale(570), minWidth: ri.scale(688)}}
		itemRenderer={renderItem}
	/>
);

number('dataSize', WithAsyncRender, Config, defaultDataSize);
select('direction', WithAsyncRender, prop.direction, Config);
object('src', WithAsyncRender, Config, src);

WithAsyncRender.storyName = 'with async render';
