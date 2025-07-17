import {Chip, Chips, ChipsBase} from '@enact/limestone/Chips';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {select} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';
import {useState} from 'react';

const Config = mergeComponentMetadata('Chips', ChipsBase, Chips);
Chips.displayName = 'Chips';

export default {
	title: 'Limestone/Chips',
	component: 'Chips'
};

let chipIdCounter = 0;

const generateSingleChip = (index) => {
	const icons = ['check', 'heart', 'channel', 'ai', 'star', 'home', 'music', 'search'];
	const chipLabels = [
		'chip1',
		'chip2',
		'This is a very long chip3',
		'chip4',
		'favorite',
		'home',
		'music player',
		'search tool'
	];

	return {
		id: `chip-${++chipIdCounter}`,
		children: chipLabels[index % chipLabels.length] || `chip${index + 1}`,
		icon: icons[index % icons.length]
	};
};

const generateChips = (count) => {
	return Array.from({length: count}, (_, index) => generateSingleChip(index));
};

const initialChips = generateChips(8);

export const Chips_ = (args) => {
	const [chips, setChips] = useState(initialChips);
	const orientation = args['orientation'];

	const handleDelete = (id) => {
		action('onDelete')({id});
		setChips(chips.filter(chip => chip.id !== id));
	};

	return (
		<Chips orientation={orientation} style={{margin: ri.scaleToRem(36)}}>
			{chips.map(({id, icon, children}) => {
				const deleteButton = {
					position: orientation === 'vertical' ? 'right' : 'bottom',
					onDelete: () => handleDelete(id)
				};

				return (
					<Chip
						key={id}
						id={id}
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
