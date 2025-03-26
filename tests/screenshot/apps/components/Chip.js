import Chip from '../../../../Chip';
import {withConfig} from './utils';

const ChipTests = [
	<Chip />,
	<Chip>chip</Chip>,

	<Chip icon="check">chip</Chip>,

	<Chip deleteButton>chip</Chip>,
	<Chip deleteButton={false}>chip</Chip>,

	<Chip deleteButton={{icon: 'closex', position: 'right'}}>chip</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'top'}}>chip</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'bottom'}}>chip</Chip>,

	<Chip disabled>chip</Chip>,
	<Chip icon="check" disabled>chip</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'right'}} disabled>chip</Chip>,

	<Chip icon="check" deleteButton={{icon: 'delete', position: 'right'}}>chip</Chip>,
	<Chip icon="check" deleteButton={{icon: 'delete', position: 'top'}}>chip</Chip>,
	<Chip icon="check" deleteButton={{icon: 'delete', position: 'bottom'}} disabled>chip</Chip>,

	// Focused
	...withConfig({focus: true}, [
		<Chip>chip</Chip>,
		<Chip icon="check">chip</Chip>,
		<Chip deleteButton={{icon: 'closex', position: 'right'}}>chip</Chip>,
		<Chip icon="check" deleteButton={{icon: 'delete', position: 'right'}}>chip</Chip>
	])
];

export default ChipTests;
