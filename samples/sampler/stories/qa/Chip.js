import Chip from '@enact/limestone/Chip';
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

export const WithDeleted = () => {
	const [chips, setChips] = useState(defaultChips);

	const handleDelete = (id) => {
		setChips(chips.filter(chip => chip.id !== id));
	};

	return (
		<div>
			{chips.map((chip, index) => {
				const deleteButton = {icon: 'closex', position: 'bottom', onClick: () => handleDelete(chip.id)};
				return (
					<Chip
						key={index}
						icon={chip.icon}
						deleteButton={deleteButton}
					>
						{chip.children}
					</Chip>
				);
			})}
		</div>
	);
};

WithDeleted.storyName = 'with deleted';
