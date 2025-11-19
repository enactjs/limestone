import Button from '@enact/limestone/Button';
import ContextualPopupDecorator from '@enact/limestone/ContextualPopupDecorator';
import {RadioItemGroup} from '@enact/limestone/RadioItem';
import Toggleable from '@enact/ui/Toggleable';

import Section from '../components/Section';

const ContextualButton = Toggleable(
	{prop: 'open', toggle: 'onClick', deactivate: 'onClose'},
	ContextualPopupDecorator(
		Button
	)
);

const renderPopup1 = () => (
	<div>
		<span>Item 0</span>
		<br />
		<span>Item 1</span>
		<br />
		<span>Item 2</span>
		<br />
		<span disabled>Item 3</span>
		<br />
	</div>
);

const renderPopup2 = () => (
	<div>
		<Button>Text 0</Button>
		<Button>Text 1</Button>
		<Button>Text 2</Button>
		<Button disabled>Text 3</Button>
	</div>
);

const renderPopup3 = () => (
	<RadioItemGroup
		defaultSelected={0}
		itemProps={{inline: false}}
		select="radio"
		selectedProp="selected"
	>
		{['Item 0', 'Item 1', 'Item 2']}
	</RadioItemGroup>
);

const renderPopup4 = () => (
	<RadioItemGroup
		defaultSelected={0}
		itemProps={{inline: false, disabled: true}}
		select="radio"
		selectedProp="selected"
	>
		{['Item 0', 'Item 1', 'Item 2']}
	</RadioItemGroup>
);

const ContextualPopupDecoratorView = () => {
	return (
		<Section title="Button wrapped with ContextualPopupDecorator">
			<ContextualButton alt="With Texts" popupComponent={renderPopup1}>Text 0</ContextualButton>
			<ContextualButton alt="With Buttons" popupComponent={renderPopup2}>Text 1</ContextualButton>
			<ContextualButton alt="With RadioItems in Group" direction="below" popupComponent={renderPopup3} popupProps={{'aria-label': "Item 0 Item 1 Item 2"}}>Text 2</ContextualButton>
			<ContextualButton alt="With Disabled RadioItems in Group" direction="below" popupComponent={renderPopup4} popupProps={{'aria-label': "Item 0 Item 1 Item 2"}}>Text 3</ContextualButton>
			<ContextualButton alt="Disabled" disabled popupComponent={renderPopup1}>Text 4</ContextualButton>
		</Section>
	);
};

export default ContextualPopupDecoratorView;
