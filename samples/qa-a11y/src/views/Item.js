import Icon from '@enact/limestone/Icon';
import Item from '@enact/limestone/Item';

import Section from '../components/Section';

import appCss from '../App/App.module.less';

const ItemView = () => (
	<>
		<Section title="Default">
			<Item alt="No Text" />
			<Item alt="Normal">Item 0</Item>
			<Item alt="Disabled" disabled>Item 1</Item>
		</Section>

		<Section className={appCss.marginTop} title="With Label">
			<Item alt="With Label" label="Label">Item 0</Item>
			<Item alt="Disabled with Label" disabled label="Label">Item 1</Item>
			<Item alt="With Label and labelPosition" label="Label" labelPosition="above">Item 2</Item>
		</Section>

		<Section className={appCss.marginTop} title="With Icon and Icon aria-label">
			<Item alt="With slotBefore Icon" slotBefore={<Icon size="small">arrowlargeleft</Icon>} slotBeforeAria="slot before icon">Item 0</Item>
			<Item alt="With slotAfter Icon" slotAfter={<Icon size="small">arrowlargeright</Icon>} slotAfterAria="slot after icon">Item 1</Item>
			<Item
				alt="With slotBefore and slotAfter Icon"
				slotAfter={<Icon size="small">arrowlargeright</Icon>}
				slotAfterAria="slot after icon"
				slotBefore={<Icon size="small">arrowlargeleft</Icon>}
				slotBeforeAria="slot before icon"
			>
				Item 2
			</Item>
		</Section>

		<Section className={appCss.marginTop} title="Aria-labelled">
			<Item alt="Aria-labelled" aria-label="This is a Label 0.">Item 0</Item>
			<Item alt="Aria-labelled and Disabled" aria-label="This is a Label 1." disabled>Item 1</Item>
			<Item alt="Aria-labelled and Disabled With Label" aria-label="This is a Label 2." label="Label">Item 2</Item>
		</Section>
	</>
);

export default ItemView;
