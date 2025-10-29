import {Card} from '@enact/limestone/Card';
import {InputField} from '@enact/limestone/Input';
import {Panel} from '@enact/limestone/Panels';
import Scroller from '@enact/limestone/Scroller';
import {Cell, Row} from '@enact/ui/Layout';

import {useCallback, useState} from 'react';

import css from './MainView.module.less';

import ScrollerSwitch from '../components/ScrollerSwitch';

const cardElements = (numberOfElements, imageSrc) => {
	return Array.from({length: numberOfElements}, (_, i) => {
		return (
			<Cell key={i} shrink style={{paddingBlock: '1em'}}>
				<Card src={imageSrc}>
					Card Title: {i + 1}
				</Card>
			</Cell>
		)}
	);
}

export const svgGenerator = (width, height, bgColor, textColor, customText) => (
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' width='${width}' height='${height}'%3E` +
	`%3Crect width='${width}' height='${height}' fill='%23${bgColor}'%3E%3C/rect%3E` +
	`%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='36px' fill='%23${textColor}'%3E${customText}%3C/text%3E%3C/svg%3E`
);

const src = {
	hd: svgGenerator(200, 200, '7ed31d', 'ffffff', '200 X 200'),
	fhd: svgGenerator(300, 300, '7ed31d', 'ffffff', '300 X 300'),
	uhd: svgGenerator(600, 600, '7ed31d', 'ffffff', '600 X 600')
};

const MainView = () => {
	const [elements, setElements] = useState([cardElements(10, src)]);
	const [numberOfElements, setNumberOfElements] = useState(10);
	const [hoverToScroll, setHoverToScroll] = useState(false);

	const handleHoverToScroll = useCallback(({selected}) => setHoverToScroll(selected), []);
	const handleElements = useCallback(({value}) => {
		setNumberOfElements(value);
		setElements(() => cardElements(value, src));
	}, []);

	return (
		<Panel>
			<Row>
				<Cell shrink>
					<label>Elements: </label>
					<InputField css={css} size="small" onChange={handleElements} type="number" value={numberOfElements} style={{width: '4em'}} />
				</Cell>
				<Cell>
					<ScrollerSwitch defaultSelected={hoverToScroll} onToggle={handleHoverToScroll} title='Hover To Scroll' />
				</Cell>
			</Row>
			<Scroller
				direction='vertical'
				key='translate'
				scrollMode='translate'
			>
				<Scroller
					direction='horizontal'
					key='translate-1'
					hoverToScroll={hoverToScroll}
					scrollMode='translate'
				>
					<Row>
						{elements}
					</Row>
				</Scroller>
				<Scroller
					direction='horizontal'
					key='translate-2'
					hoverToScroll={hoverToScroll}
					scrollMode='translate'
				>
					<Row>
						{elements}
					</Row>
				</Scroller>
			</Scroller>
		</Panel>
	);
};

export default MainView;
