import CheckboxItem, {CheckboxItemGroup} from '@enact/limestone/CheckboxItem';

import Section from '../components/Section';

import appCss from '../App/App.module.less';

const CheckboxItemView = () => (
	<>
		<Section title="Default">
			<CheckboxItem alt="Normal">Text 0</CheckboxItem>
			<CheckboxItem alt="Disabled" disabled>Text 1</CheckboxItem>
		</Section>

		<Section className={appCss.marginTop} title="Aria-labelled">
			<CheckboxItem alt="Aria-labelled" aria-label="This is a Label 0.">Text 0</CheckboxItem>
			<CheckboxItem alt="Aria-labelled and Disabled" aria-label="This is a Label 1." disabled>Text 1</CheckboxItem>
		</Section>

		<Section title="CheckboxItem Group">
			<CheckboxItemGroup alt="Grouped">
				<CheckboxItem>Text 0</CheckboxItem>
				<CheckboxItem disabled>Text 1</CheckboxItem>
			</CheckboxItemGroup>
		</Section>
	</>
);

export default CheckboxItemView;
