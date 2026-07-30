import Item, {ItemBase} from '@enact/limestone/Item';
import Icon from '@enact/limestone/Icon';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';
import UiItem, {ItemBase as UiItemBase} from '@enact/ui/Item';

const Config = mergeComponentMetadata('Item', UiItemBase, UiItem, ItemBase, Item);
Item.displayName = 'Item';

export default {
	title: 'Limestone/Item',
	component: 'Item'
};

export const _Item = (args) => {
	const controls = {
		centered: args['centered'],
		disabled: args['disabled'],
		inline: args['inline'],
		label: args['label'],
		labelPosition: args['labelPosition'],
		size: args['size']
	};

	const slotBefore = args['slotBefore'] ? (
		<Icon size="small">speaker</Icon>
	) : null;

	const slotAfter = args['slotAfter'] ? (
		<Icon size="small">arrowlargeright</Icon>
	) : null;

	return (
		<Item
			{...controls}
			slotBefore={slotBefore}
			slotAfter={slotAfter}
		>
			{args['children']}
		</Item>
	);
};

boolean('centered', _Item, Config);
boolean('disabled', _Item, Config);
boolean('inline', _Item, Config);
text('label', _Item, Config);
select('labelPosition', _Item, ['above', 'below', 'before', 'after'], Config);
select('size', _Item, ['small', 'large'], Config);
select('slotBefore', _Item, {'': '', '<Icon />': 'icon'}, Config);
select('slotAfter', _Item, {'': '', '<Icon />': 'icon'}, Config);
text('children', _Item, Config, 'Hello Item');

_Item.storyName = 'Item';
_Item.parameters = {
	info: {
		text: 'Basic usage of Item'
	}
};
