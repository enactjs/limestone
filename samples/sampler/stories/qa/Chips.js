/* eslint-disable react/jsx-no-bind */
import Button from '@enact/limestone/Button';
import Chips, {ChipsBase, Chip} from '@enact/limestone/Chips';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';
import {useState} from 'react';

Chips.displayName = 'Chips';
const Config = mergeComponentMetadata('Chips', ChipsBase, Chips);

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
						id={id}
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

select('orientation', WithDisabled, ['horizontal', 'vertical'], Config, 'vertical');
boolean('disabled', WithDisabled, Config, true);

WithDisabled.storyName = 'with disabled';

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

const initialChips = generateChips(4);

export const WithAdding = (args) => {
	const [chips, setChips] = useState(initialChips);
	const orientation = args['orientation'];

	const handleAddChip = () => {
		const newChip = generateSingleChip(chips.length);
		setChips([...chips, newChip]);
		action('onAdd')({chip: newChip});
	};

	const handleDelete = (id) => {
		action('onDelete')({id});
		setChips(chips.filter(chip => chip.id !== id));
	};

	return (
		<div style={{margin: ri.scaleToRem(36)}}>
			<Chips
				orientation={orientation}
			>
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
			<Button
				onClick={handleAddChip}
				style={{
					position: 'absolute',
					bottom: ri.scaleToRem(36),
					right: ri.scaleToRem(36),
					zIndex: 1
				}}
			>
				Add Chip
			</Button>
		</div>
	);
};

select('orientation', WithAdding, ['horizontal', 'vertical'], Config, 'vertical');

WithAdding.storyName = 'with adding';
