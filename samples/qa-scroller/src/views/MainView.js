import DatePicker from '@enact/limestone/DatePicker';
import {InputField as Input} from '@enact/limestone/Input';
import Item from '@enact/limestone/Item';
import {Panel, Header} from '@enact/limestone/Panels';
import Picker from '@enact/limestone/Picker';
import RadioItem from '@enact/limestone/RadioItem';
import Scroller from '@enact/limestone/Scroller';
import TimePicker from '@enact/limestone/TimePicker';
import Group from '@enact/ui/Group';
import ri from '@enact/ui/resolution';
import {useCallback, useState} from 'react';

import Controls from '../components/Controls';

const
	airports = [
		'San Francisco Airport Terminal Gate 1',
		'Boston Airport Terminal Gate 2',
		'Tokyo Airport Terminal Gate 3',
		'נמל התעופה בן גוריון טרמינל הבינלאומי'
	],
	data = [],
	itemData = [];

for (let i = 0; i < 20; i++) {
	data.push(airports[i % 4]);
}

for (let i = 0; i < 50; i++) {
	itemData.push(`Item ${i}`);
}

const MainView = () => {
	const [focusableScrollbar, setFocusableScrollbar] = useState(false);
	const [height, setHeight] = useState(4000);
	const [nativeScroll, setNativeScroll] = useState(true);
	const [width, setWidth] = useState(2000);

	const getScaledSize = (size) => ri.scale(parseInt(size) || 0);

	const handleFocusableScrollbar = useCallback(() => setFocusableScrollbar(!focusableScrollbar), [focusableScrollbar]);
	const handleHeight = useCallback(({value}) => setHeight(value), []);
	const handleScrollMode = useCallback(({selected: selNativeScroll}) => setNativeScroll(selNativeScroll), []);
	const handleWidth = useCallback(({value}) => setWidth(value), []);

	return (
		<Panel>
			<Header title="Scroller" type="mini">
				<Controls
					handleFocusableScrollbar={handleFocusableScrollbar}
					handleHeight={handleHeight}
					handleScrollMode={handleScrollMode}
					handleWidth={handleWidth}
					height={height}
					nativeScroll={nativeScroll}
					width={width}
				/>
			</Header>
			<Scroller
				focusableScrollbar={focusableScrollbar}
				key={nativeScroll ? 'native' : 'translate'}
				scrollMode={nativeScroll ? 'native' : 'translate'}
			>
				<div style={{height: `${getScaledSize(height)}px`, width: `${getScaledSize(width)}px`}}>
					<Input
						defaultValue="Initial value"
						title="Input with defaultValue"
					/>
					<br />
					<Picker
						orientation="vertical"
						width="medium"
					>
						{airports}
					</Picker>
					<br />
					<DatePicker
						title="DatePicker"
					/>
					<br />
					<RadioItem> FirstLongTextWithSpace FirstLongTextWithSpace FirstLongTextWithSpace FirstLongTextWithSpace </RadioItem>
					<RadioItem disabled> Default disabled Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text </RadioItem>
					<Group childComponent={Item}>
						{itemData}
					</Group>
					<TimePicker
						title="TimePicker"
					/>
				</div>
			</Scroller>
		</Panel>
	);

};

export default MainView;
