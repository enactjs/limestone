import Chip from '../../../../Chips';
import {withConfig} from './utils';

const ChipTests = [
	<Chip>Default Chip</Chip>,

	<Chip icon="check">Chip with Icon</Chip>,

	<Chip deleteButton>Chip with Delete Button</Chip>,
	<Chip deleteButton={false}>Chip without Delete Button</Chip>,

	<Chip deleteButton={{icon: 'closex', position: 'right'}}>Chip with Delete Button (Right)</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'top'}}>Chip with Delete Button (Top)</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'bottom'}}>Chip with Delete Button (Bottom)</Chip>,

	<Chip disabled>Disabled Chip</Chip>,
	<Chip icon="check" disabled>Disabled Chip with Icon</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'right'}} disabled>Disabled Chip with Delete Button (Right)</Chip>,

	<Chip icon="check" deleteButton={{icon: 'delete', position: 'right'}}>Chip with Icon and Delete Button (Right)</Chip>,
	<Chip icon="check" deleteButton={{icon: 'delete', position: 'top'}}>Chip with Icon and Delete Button (Top)</Chip>,
	<Chip icon="check" deleteButton={{icon: 'delete', position: 'bottom'}} disabled>Disabled Chip with Icon and Delete Button (Bottom)</Chip>,

	// Focused
	...withConfig({focus: true}, [
		<Chip>Focused Default Chip</Chip>,
		<Chip icon="check">Focused Chip with Icon</Chip>,
		<Chip deleteButton={{icon: 'closex', position: 'right'}}>Focused Chip with Delete Button (Right)</Chip>,
		<Chip icon="check" deleteButton={{icon: 'delete', position: 'right'}}>Focused Chip with Icon and Delete Button (Right)</Chip>
	])
];

export default ChipTests;
