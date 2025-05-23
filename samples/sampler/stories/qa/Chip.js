import {Chip, Chips} from '@enact/limestone/Chips';
import {action} from '@enact/storybook-utils/addons/actions';
import {select} from '@enact/storybook-utils/addons/controls';
import {useState} from 'react';

Chip.displayName = 'Chip';

export default {
	title: 'Limestone/Chip',
	component: 'Chip'
};

const defaultChips = [
	{id:0, children:'chip1', icon: 'check'},
	{id:1, children:'chip2', icon: 'heart'},
	{id:2, children:'chip3', icon: 'channel'},
	{id:3, children:'chip4', icon: 'ai'}
];

export const WithDeleteButton = (args) => {
	const [chips, setChips] = useState(defaultChips);
	const orientation = args['orientation'];

	const handleDelete = (id) => {
		action('onDelete')();
		setChips(chips.filter(chip => chip.id !== id));
	};

	return (
		<Chips orientation={orientation}>
			{chips.map(({id, icon, children}, index) => {
				const deleteButton = {position: orientation === 'vertical' ? 'right' : 'bottom', onDelete: () => handleDelete(id)};
				return (
					<Chip
						key={index}
						icon={icon}
						deleteButton={deleteButton}
						onClick={action('onClick')}
					>
						{children}
					</Chip>
				);
			})}
		</Chips>
	);
};

select('orientation', WithDeleteButton, ['horizontal', 'vertical']);

WithDeleteButton.storyName = 'with delete button';
