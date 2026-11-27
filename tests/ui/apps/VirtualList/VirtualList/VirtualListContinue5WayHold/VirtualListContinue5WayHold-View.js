import spotlight from '@enact/spotlight';
import ri from '@enact/ui/resolution';

import Item from '../../../../../../Item';
import ThemeDecorator from '../../../../../../ThemeDecorator';
import VirtualList from '../../../../../../VirtualList';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const continue5WayHold = new URLSearchParams(window.location.search).get('continue5WayHold') === 'true';

const numOfLists = 3;
const dataSize = 10;
const itemSize = ri.scale(300);

const itemStyle = {
	width: itemSize,
	height: ri.scale(150),
	margin: 0
};

const listStyle = {
	height: ri.scale(180),
	margin: '0px'
};

// eslint-disable-next-line enact/display-name
const renderItem = (listIndex) => ({index, ...rest}) => (
	<Item {...rest} id={`list${listIndex}-item${index}`} style={itemStyle}>
		{`List${listIndex} ${index}`}
	</Item>
);

const App = (props) => (
	<div id="view" {...props}>
		{Array.from({length: numOfLists}, (v, listIndex) => (
			<VirtualList
				continue5WayHold={continue5WayHold}
				dataSize={dataSize}
				direction="horizontal"
				id={`list${listIndex}`}
				itemRenderer={renderItem(listIndex)}
				itemSize={itemSize}
				key={listIndex}
				spotlightId={`list${listIndex}`}
				style={listStyle}
			/>
		))}
	</div>
);

export default ThemeDecorator(App);
