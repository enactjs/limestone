import * as React from 'react';

import Button from '@enact/limestone/Button';
import Item from '@enact/limestone/Item';
import Scroller from '@enact/limestone/Scroller';
import FixedPopupPanels, {Panel, Header} from '@enact/limestone/FixedPopupPanels';
import * as Panels from '@enact/limestone/Panels';

import css from './ScrollerHeight.module.less';

const ScrollIssue = () => {
	const [index, setIndex] = React.useState(0);

	const handleBack = React.useCallback(() => {
		setIndex(0);
	}, []);

	const handleClick = React.useCallback(() => {
		setIndex(1);
	}, []);

	const handleClick2 = React.useCallback(() => {
		setIndex(0);
	}, []);

	return (
		<Panels.Panel>
			<Panels.Header title="Scroll Issue" />
			<FixedPopupPanels open index={index} onBack={handleBack}>
				<Panel>
					<Header title="Tab 1" slotBefore={<Button icon="ai" />} subtitle="ABC" />
					<Scroller className={css.scroller}>
						{Array.from({length: 15}, (_, i) => (
							<Item key={`first_${i}`} onClick={handleClick}>Item {i + 1}</Item>
						))}
					</Scroller>
				</Panel>
				<Panel>
					<Header title="Tab 2" />
					<Scroller className={css.scroller}>
						{Array.from({length: 12}, (_, i) => (
							<Item key={`second_${i}`} onClick={handleClick2}>Item {i + 1}</Item>
						))}
					</Scroller>
				</Panel>
			</FixedPopupPanels>
		</Panels.Panel>
	);
};

export default ScrollIssue;