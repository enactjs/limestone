import Heading from '@enact/limestone/Heading';
import RadioItem, {RadioItemGroup} from '@enact/limestone/RadioItem';
import {useCallback, useState} from 'react';

import CommonView from '../../components/CommonView';

const IntentSelectRadioItem = () => {
	const [selected, setSelected] = useState(0);

	const handleSelect = useCallback((e) => setSelected(e.selected), []);

	return (
		<CommonView title="Intent to select RadioItem">
			<Heading>RadioItem</Heading>
			<RadioItem data-testid="apple">사과</RadioItem>
			<Heading>RadioItem Group - radio selection</Heading>
			<RadioItemGroup
				select="radio"
				selectedProp="selected"
				selected={selected}
				onSelect={handleSelect}
			>
				{[
					'사진',
					'바나나',
					'음악'
				]}
			</RadioItemGroup>
		</CommonView>
	);
};

export default IntentSelectRadioItem;
