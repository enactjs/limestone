import Chip from '@enact/limestone/Chip';
import {action} from '@enact/storybook-utils/addons/actions';
import {select} from '@enact/storybook-utils/addons/controls';
import {Column, Row} from '@enact/ui/Layout';
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
	const Layout = args['layout'] === 'horizontal' ? Row : Column;

	const handleDelete = (id) => {
		action('onDelete')();
		setChips(chips.filter(chip => chip.id !== id));
	};

	return (
		<Layout inline>
			{chips.map(({id, icon, children}, index) => {
				const deleteButton = {position: Layout === Row ? 'bottom' : 'right', onDelete: () => handleDelete(id)};
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
		</Layout>
	);
};

select('layout', WithDeleteButton, ['horizontal', 'vertical']);

WithDeleteButton.storyName = 'with delete button';
