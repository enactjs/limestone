import {Chip, Chips, ChipsBase} from '@enact/limestone/Chips';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {select} from '@enact/storybook-utils/addons/controls';
import {useState} from 'react';

const Config = mergeComponentMetadata('Chips', ChipsBase, Chips);
Chips.displayName = 'Chips';

export default {
	title: 'Limestone/Chips',
	component: 'Chips'
};

const defaultChips = [
	{id:0, children:'chip1', icon: 'check'},
	{id:1, children:'chip2', icon: 'heart'},
	{id:2, children:'chip3', icon: 'channel'},
	{id:3, children:'chip4', icon: 'ai'}
];

export const Chips_ = (args) => {
	const [chips, setChips] = useState(defaultChips);
	const orientation = args['orientation'];

	const handleDelete = (id) => {
		action('onDelete')({id});
		setChips(chips.filter(chip => chip.id !== id));
	};

	return (
		<Chips orientation={orientation}>
			{chips.map(({id, icon, children}) => {
				const deleteButton = {
					position: orientation === 'vertical' ? 'right' : 'bottom',
					onDelete: () => handleDelete(id)
				};

				return (
					<Chip
						key={id}
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

select('orientation', Chips_, ['horizontal', 'vertical'], Config, 'vertical');

Chips_.storyName = 'Chips';
Chips_.parameters = {
	info: {
		text: 'The basic Chips'
	}
};
