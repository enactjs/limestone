import Button from '@enact/limestone/Button';
import Heading from '@enact/limestone/Heading';
import SwitchItem from '@enact/limestone/SwitchItem';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, text} from '@enact/storybook-utils/addons/controls';
import Group from '@enact/ui/Group';
import {Fragment, useCallback, useState} from 'react';

SwitchItem.displayName = 'SwitchItem';

const inputData = {
	longText:
	'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	disabledLong:
	'Default disabled Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	normalText: 'Switch Item'
};

export default {
	title: 'Limestone/SwitchItem',
	component: 'SwitchItem'
};

export const WithLongText = (args) => (
	<div>
		<SwitchItem
			disabled={args['disabled']}
			inline={args['inline']}
			onToggle={action('onToggle')}
		>
			{args['Long Text']}
		</SwitchItem>
		<SwitchItem
			disabled
			inline={args['inline']}
			onToggle={action('onToggle')}
		>
			{args['Disable Long Text']}
		</SwitchItem>
	</div>
);

boolean('disabled', WithLongText, SwitchItem, false);
boolean('inline', WithLongText, SwitchItem, false);
text('Long Text', WithLongText, SwitchItem, inputData.longText);
text('Disable Long Text', WithLongText, SwitchItem, inputData.disabledLong);

WithLongText.storyName = 'with Long Text';

export const _Group = (args) => (
	<div>
		<Heading showLine>{'Switch items with normal text in a group'}</Heading>
		<Group
			childComponent={SwitchItem}
			itemProps={{
				inline: args['ItemProps-Inline'],
				disabled: args['disabled']
			}}
			selectedProp="selected"
			defaultSelected={1}
			onSelect={action('onSelect')}
		>
			{[
				args['Normal Text 1'],
				args['Normal Text 2'],
				args['Normal Text 3']
			]}
		</Group>
		<Heading showLine>{'Switch items with long text in a group'}</Heading>
		<Group
			childComponent={SwitchItem}
			itemProps={{
				inline: args['ItemProps-Inline'],
				disabled: args['disabled']
			}}
			childSelect="onToggle"
			selectedProp="selected"
			disabled={args['disabled']}
			defaultSelected={1}
			onSelect={action('onSelect')}
		>
			{[
				args['Long Text 1'],
				args['Long Text 2'],
				args['Long Text 3']
			]}
		</Group>
	</div>
);

boolean('ItemProps-Inline', _Group, SwitchItem, false);
boolean('disabled', _Group, SwitchItem, false);
text('Normal Text 1', _Group, SwitchItem, inputData.normalText + 1);
text('Normal Text 2', _Group, SwitchItem, inputData.normalText + 2);
text('Normal Text 3', _Group, SwitchItem, inputData.normalText + 3);
text('Long Text 1', _Group, SwitchItem, 'First ' + inputData.longText);
text('Long Text 2', _Group, SwitchItem, 'Second ' + inputData.longText);
text('Long Text 3', _Group, SwitchItem, 'Third ' + inputData.longText);

_Group.storyName = 'Group';

// QEVENTTH-15000 / NXT-21006
//
// A selected SwitchItem used to replay the handle "bounce" animation every time it re-mounted
// (e.g. navigating away from a panel and back), even though the toggle state had not changed,
// because the bounce is a CSS `animation` that the browser replays on mount. This story
// re-mounts the SwitchItem on demand so the behavior can be checked by eye.
//
// Steps:
//   1. Toggle "Microphone" on — the handle should bounce once (expected).
//   2. Press "Re-mount the switch above" repeatedly. The switch stays on and must NOT bounce.
// The handle should still bounce only when it is actually toggled off and back on.
export const BounceOnReMount = (args) => {
	const disabled = args['disabled'];
	const [selected, setSelected] = useState(true);
	const [mountKey, setMountKey] = useState(0);

	const handleToggle = useCallback((ev) => {
		setSelected(ev.selected);
		action('onToggle')(ev);
	}, []);
	const remount = useCallback(() => setMountKey((k) => k + 1), []);

	return (
		<div>
			<Heading showLine>{'Re-mount should not replay the bounce (QEVENTTH-15000)'}</Heading>
			<Fragment key={mountKey}>
				<SwitchItem
					disabled={disabled}
					onToggle={handleToggle}
					selected={selected}
				>
					{'Microphone'}
				</SwitchItem>
			</Fragment>
			<Button onClick={remount} size="small">
				{'Re-mount the switch above'}
			</Button>
		</div>
	);
};

boolean('disabled', BounceOnReMount, SwitchItem, false);

BounceOnReMount.storyName = 'bounce on re-mount';
BounceOnReMount.parameters = {
	info: {
		text: 'A selected SwitchItem should not replay the bounce animation when it re-mounts.'
	}
};
