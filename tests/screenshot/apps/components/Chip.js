import {Chip} from '../../../../Chips';
import gameHomeIcon from '../../images/icon_app_game.png';

import {withConfig, withTallglyphLocale, TallglyphLatin, TallglyphMultiScript} from './utils';

const chipSmokeTests = [
	<Chip>Default Chip</Chip>,

	<Chip icon="home">Chip with Icon</Chip>,
	<Chip icon="check">Chip with check Icon</Chip>, // Default Chip without any Icon
	<Chip icon="checkmark">Chip with checkmark Icon</Chip>, // Default Chip without any Icon
	<Chip isImage icon={gameHomeIcon}>Chip with Image</Chip>,

	<Chip deleteButton>Chip with Delete Button</Chip>,
	<Chip deleteButton={false}>Chip without Delete Button</Chip>,

	<Chip deleteButton={{icon: 'closex', position: 'right'}}>Chip with Delete Button (Right)</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'top'}}>Chip with Delete Button (Top)</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'bottom'}}>Chip with Delete Button (Bottom)</Chip>,

	<Chip checked>Checked Chip</Chip>,
	<Chip checked icon="home">Checked Chip with Icon</Chip>,
	<Chip checked isImage icon={gameHomeIcon}>Checked Chip with Image</Chip>,
	<Chip checked deleteButton={{icon: 'closex', position: 'right'}}>Checked Chip with Delete Button (Right)</Chip>,

	<Chip disabled>Disabled Chip</Chip>,
	<Chip disabled icon="home">Disabled Chip with Icon</Chip>,
	<Chip disabled isImage icon={gameHomeIcon}>Disabled Chip with Image</Chip>,
	<Chip disabled deleteButton={{icon: 'closex', position: 'right'}}>Disabled Chip with Delete Button (Right)</Chip>,

	<Chip icon="home" deleteButton={{icon: 'closex', position: 'right'}}>Chip with Icon and Delete Button (Right)</Chip>,
	<Chip icon="home" deleteButton={{icon: 'closex', position: 'top'}}>Chip with Icon and Delete Button (Top)</Chip>,
	<Chip icon="home" deleteButton={{icon: 'closex', position: 'bottom'}} disabled>Disabled Chip with Icon and Delete Button (Bottom)</Chip>
];

const chipFocusTests = [
	// Focused — smoke representatives
	<Chip>Focused Default Chip</Chip>,
	<Chip icon="home">Focused Chip with Icon</Chip>,
	<Chip checked>Checked and Focused Chip</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'right'}}>Focused Chip with Delete Button (Right)</Chip>
];

const chipLargeTextTests = [
	// Large Text — smoke representatives
	<Chip>Default Chip</Chip>,
	<Chip icon="home">Chip with Icon</Chip>,
	<Chip checked>Checked Chip</Chip>,
	<Chip deleteButton={{icon: 'closex', position: 'right'}}>Chip with Delete Button (Right)</Chip>
];

const chipTallglyphTests = [
	<Chip>{TallglyphMultiScript}</Chip>,
	<Chip icon="home">{TallglyphLatin}</Chip>
];

const ChipTests = [
	...chipSmokeTests,
	...withConfig({focus: true}, chipFocusTests),
	...withConfig({skinVariants: ['largeText']}, chipLargeTextTests),
	...withTallglyphLocale(chipTallglyphTests)
];

export default ChipTests;
