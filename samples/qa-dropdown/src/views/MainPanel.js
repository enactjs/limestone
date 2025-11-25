import * as React from 'react';

import Button from '@enact/limestone/Button';
import {Panel, Header} from '@enact/limestone/Panels';

import Heading from '@enact/limestone/Heading';
import VirtualList from '@enact/limestone/VirtualList';
import ri from '@enact/ui/resolution';
import {Card} from '@enact/limestone/Card';
import {ContentContainerDecorator} from '@enact/limestone/Scroller';

import css from '../App/App.module.less';

const svgGenerator = (width, height, bgColor, textColor, customText) => (
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' width='${width}' height='${height}'%3E` +
	`%3Crect width='${width}' height='${height}' fill='%23${bgColor}'%3E%3C/rect%3E` +
	`%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='36px' fill='%23${textColor}'%3E${customText}%3C/text%3E%3C/svg%3E`
);

const generateImageSrc = (color, width, height) => {
	return {
		hd: svgGenerator(width / 4, height / 4, color, 'ffffff', `${width / 4} X ${height / 4}`),
		fhd: svgGenerator(width / 2, height / 2, color, 'ffffff', `${width / 2} X ${height / 2}`),
		uhd: svgGenerator(width, height, color, 'ffffff', `${width} X ${height}`)
	};
};

const Container = ContentContainerDecorator('div');

function Shelf({
				   handleCbScrollTo,
				   heading,
				   data
			   }) {
	const getStyle = React.useCallback(({width, height}) => {
		return {
			width,
			height
		};
	}, []);

	const renderItem = React.useCallback(({index, ...rest}) => {
		const currentData = data[index];

		return (
			<Card
				{...rest}
				spotlightId={`card-item-${index}`}
				src={generateImageSrc('A3A3A3', currentData.width, currentData.height)}
				label={currentData.subText}
				roundedImage
				className={css.item}
				imageSize={getStyle(currentData)}
			>
				{currentData.text}
			</Card>
		);
	}, [getStyle, data]);

	return (
		<Container>
			<Heading showLine>{heading}</Heading>
			<div>
				<VirtualList
					cbScrollTo={handleCbScrollTo}
					className={css.itemArea}
					dataSize={data.length}
					direction="horizontal"
					itemRenderer={renderItem}
					itemSize={ri.scale(720)}
					hoverToScroll
					noScrollByWheel
					horizontalScrollbar="hidden"
				/>
			</div>
		</Container>
	);
};

const getCards = dataSize => {
	const items = [];
	const itemNumberDigits = dataSize > 0 ? (dataSize - 1 + '').length : 0;
	const headingZeros = Array(itemNumberDigits).join('0');
	const longContent = 'Lorem ipsum dolor sit amet';
	const shouldAddLongContent = ({index, modIndex}) =>
		index % modIndex === 0 ? ` ${longContent}` : '';

	for (let i = 0; i < dataSize; i++) {
		const count = (headingZeros + i).slice(-itemNumberDigits);
		const text = `Item ${count}${shouldAddLongContent({index: i, modIndex: 2})}`;
		const subText = `SubItem ${count}${shouldAddLongContent({index: i, modIndex: 3})}`;

		items.push({
			text,
			subText,
			width: 660,
			height: 600
		});
	}

	return items;
};

const MainPanel = props => {
	const [dataSize, setDataSize] = React.useState(20);
	const scrollTo = React.useRef(() => {});
	const renderCount = React.useRef(0);
	const clickCount = React.useRef(0);

	const handleClick = React.useCallback(() => {
		clickCount.current += 1;

		const newSize = Math.floor(Math.random() * dataSize) + 15;

		setDataSize(newSize);

		setTimeout(() => {
			scrollTo.current({index: newSize - 5, animate: true});
		}, 0);

	}, [dataSize]);

	const handleCbScrollTo = React.useCallback(fn => {
		// Wrap the scroll function to log ALL scroll calls
		scrollTo.current = (params) => {
			fn(params);
		};
	}, []);

	// Initial scroll on mount only
	React.useEffect(() => {
		scrollTo.current({index: dataSize - 5, animate: true});
	}, []);

	return (
		<Panel {...props}>
			<Header title="Card Size" />
			<Button size="small" onClick={handleClick}>Scroll1</Button>
			<Button size="small" onClick={handleClick}>Scroll2</Button>
			<Button size="small" onClick={handleClick}>Scroll3</Button>
			<Button size="small" onClick={handleClick}>Scroll4</Button>
			<Button size="small" onClick={handleClick}>Scroll5</Button>
			<Button size="small" onClick={handleClick}>Scroll6</Button>
			<Shelf
				handleCbScrollTo={handleCbScrollTo}
				heading="Card Size 1 (600x600)"
				data={getCards(dataSize)}
			/>
		</Panel>

	);
};

export default MainPanel;