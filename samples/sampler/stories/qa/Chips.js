import {Chip, Chips} from '@enact/limestone/Chips';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select} from '@enact/storybook-utils/addons/controls';
import {useState} from 'react';

Chips.displayName = 'Chips';
const Config = mergeComponentMetadata('Chips', Chips);

export default {
	title: 'Limestone/Chips',
	component: 'Chips'
};

const defaultChips = [
	{id:0, children:'chip1', icon: 'check'},
	{id:1, children:'chip2', icon: 'heart'},
	{id:2, children:'chip3', icon: 'channel'},
	{id:3, children:'chip4', icon: 'arrowup'},
	{id:4, children:'chip5', icon: 'folder'},
	{id:5, children:'chip6', icon: 'support'},
	{id:6, children:'chip7', icon: 'help'},
	{id:7, children:'chip8', icon: 'mobile'}
];

export const WithDisabled = (args) => {
	const [chips, setChips] = useState(defaultChips);
	const orientation = args['orientation'];

	const handleDelete = (id) => {
		action('onDelete')({id});
		setChips(chips.filter(chip => chip.id !== id));
	};
	return (
		<Chips orientation={orientation}>
			{chips.map(({id, icon, children}, index) => {
				const deleteButton = {
					position: orientation === 'vertical' ? 'right' : 'bottom',
					onDelete: () => handleDelete(id)
				};
				return (
					<Chip
						key={id}
						icon={icon}
						deleteButton={deleteButton}
						disabled={index % 3 === 0 || index % 5 === 0 ? args.disabled : false}
						onClick={action('onClick')}
					>
						{children}
					</Chip>
				);
			})}
		</Chips>
	);
};

select('orientation', WithDisabled, ['horizontal', 'vertical'], 'vertical');
boolean('disabled', WithDisabled, Config, true);

WithDisabled.storyName = 'with disabled';
