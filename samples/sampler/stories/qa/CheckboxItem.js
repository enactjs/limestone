import CheckboxItem, {CheckboxItemGroup} from '@enact/limestone/CheckboxItem';
import Item, {ItemBase} from '@enact/limestone/Item';
import Scroller from '@enact/limestone/Scroller';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';
import Group from '@enact/ui/Group';

Group.displayName = 'Group';
const Config = mergeComponentMetadata('CheckboxItem', ItemBase, Item, CheckboxItem);

const prop = {
	longText:
	'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	tallText: ['नरेंद्र मोदी', 'ฟิ้ ไั ஒ து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ', 'តន្ត្រី'],
	extraSpaceText: 'This		Text 		has			extra 		space',
	rtlText: 'هناك حقيقة مثبتة منذ زمن طويل وهي'
};

export default {
	title: 'Limestone/CheckboxItem',
	component: 'CheckboxItem'
};

export const WithLongText = (args) => (
	<CheckboxItem
		disabled={args['disabled']}
		inline={args['inline']}
		onToggle={action('onToggle')}
	>
		{args['children']}
	</CheckboxItem>
);

boolean('disabled', WithLongText, Config, false);
boolean('inline', WithLongText, Config);
text('children', WithLongText, Config, prop.longText);

WithLongText.storyName = 'with long text';

export const WithTallCharacters = (args) => {
	const controls = {
		disabled: args['disabled'],
		inline: args['inline']
	};

	return (
		<CheckboxItem
			{...controls}
			onToggle={action('onToggle')}
		>
			{args['children']}
		</CheckboxItem>
	);
};

boolean('disabled', WithTallCharacters, Config, false);
boolean('inline', WithTallCharacters, Config);
select('children', WithTallCharacters, prop.tallText, Config, prop.tallText[0]);

WithTallCharacters.storyName = 'with tall characters';

export const WithExtraSpacing = (args) => {
	const controls = {
		disabled: args['disabled'],
		inline: args['inline']
	};

	return (
		<CheckboxItem
			{...controls}
			onToggle={action('onToggle')}
		>
			{args['children']}
		</CheckboxItem>
	);
};

boolean('disabled', WithExtraSpacing, Config, false);
boolean('inline', WithExtraSpacing, Config);
text('children', WithExtraSpacing, Config, prop.extraSpaceText);

WithExtraSpacing.storyName = 'with extra spacing';

export const WithRightToLeftText = (args) => {
	const controls = {
		disabled: args['disabled'],
		inline: args['inline']
	};

	return (
		<CheckboxItem
			{...controls}
			onToggle={action('onToggle')}
		>
			{args['children']}
		</CheckboxItem>
	);
};

boolean('disabled', WithRightToLeftText, Config, false);
boolean('inline', WithRightToLeftText, Config);
text('children', WithRightToLeftText, Config, prop.rtlText);

WithRightToLeftText.storyName = 'with right to left text';

export const Grouped = (args) => {
	const controls = {
		itemProps: {
			inline: args['itemProps-inline'],
			disabled: args['itemProps-disabled']
		},
		select: args['select']
	};

	return (
		<CheckboxItemGroup
			{...controls}
			selectedProp="selected"
			defaultSelected={0}
			onSelect={action('onSelect')}
		>
			{['Checkbox Item 1', 'Checkbox Item 2', 'Checkbox Item 3']}
		</CheckboxItemGroup>
	);
};

boolean('itemProps-disabled', Grouped, Config, false);
boolean('itemProps-inline', Grouped, Config, false);
select('select', Grouped, ['single', 'radio', 'multiple'], Group, 'multiple');

Grouped.storyName = 'grouped';

export const MultipleCheckBoxItems = (args) => (
	<Scroller>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 1
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 2
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 3
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 4
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 5
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 6
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 7
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 8
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 9
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 10
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 11
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 12
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 13
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 14
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 15
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 16
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 17
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 18
		</CheckboxItem>
		<CheckboxItem formCheckbox={args['formCheckbox']}>
			Checkbox Item 19
		</CheckboxItem>
	</Scroller>
);

boolean('formCheckbox', MultipleCheckBoxItems, Config, false);

MultipleCheckBoxItems.storyName = 'multipleCheckboxItems';
