import Item, {ItemBase} from '@enact/limestone/Item';
import Icon from '@enact/limestone/Icon';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, select, text} from '@enact/storybook-utils/addons/controls';
import UiItem, {ItemBase as UiItemBase} from '@enact/ui/Item';
import {expect, fn, userEvent, within} from 'storybook/test';

const Config = mergeComponentMetadata('Item', UiItemBase, UiItem, ItemBase, Item);
Item.displayName = 'Item';

export default {
	title: 'Limestone/Item',
	component: 'Item'
};

export const _Item = (args) => (
	<Item
		centered={args['centered']}
		disabled={args['disabled']}
		inline={args['inline']}
		onClick={args['onClick']}
		label={args['label']}
		labelPosition={args['labelPosition']}
		size={args['size']}
		slotBefore={
			args['slotBefore'] ? (
				<Icon size="small">speaker</Icon>
			) : null
		}
		slotAfter={
			args['slotAfter'] ? (
				<Icon size="small">arrowlargeright</Icon>
			) : null
		}
	>
		{args['children']}
	</Item>
);

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

_Item.args = {
	..._Item.args,
	onClick: fn()
};

_Item.play = async ({args, canvasElement, step}) => {
	const canvas = within(canvasElement);
	const label = canvas.getByText(args.children);

	await step('Item renders with its content', async () => {
		await expect(label).toBeInTheDocument();
	});

	await step('Clicking the item fires onClick', async () => {
		await userEvent.click(label, {pointerEventsCheck: 0});
		await expect(args.onClick).toHaveBeenCalled();
	});
};
