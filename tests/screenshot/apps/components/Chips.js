import Chips, {Chip} from '../../../../Chips';
import gameHomeIcon from '../../images/icon_app_game.png';

import {pick, withConfig} from './utils';

const chipsSmokeTests = [
	<Chips>
		<Chip>Chip 1</Chip>
		<Chip>Chip 2</Chip>
		<Chip>Chip 3</Chip>
	</Chips>,
	<Chips orientation="horizontal">
		<Chip>Chip 1</Chip>
		<Chip>Chip 2</Chip>
		<Chip>Chip 3</Chip>
	</Chips>,
	<Chips>
		<Chip deleteButton>Chip 1</Chip>
		<Chip deleteButton>Chip 2</Chip>
		<Chip deleteButton>Chip 3</Chip>
	</Chips>,
	<Chips>
		<Chip icon="home">Chip 1</Chip>
		<Chip icon="home">Chip 2</Chip>
		<Chip icon="home">Chip 3</Chip>
	</Chips>,
	<Chips>
		<Chip isImage icon={gameHomeIcon}>Chip 1</Chip>
		<Chip isImage icon={gameHomeIcon}>Chip 2</Chip>
		<Chip isImage icon={gameHomeIcon}>Chip 3</Chip>
	</Chips>,
	<Chips>
		<Chip checked>Chip 1</Chip>
		<Chip checked>Chip 2</Chip>
		<Chip checked>Chip 3</Chip>
	</Chips>,
	<Chips orientation="horizontal">
		<Chip disabled>Chip 1</Chip>
		<Chip disabled>Chip 2</Chip>
		<Chip disabled>Chip 3</Chip>
	</Chips>
];

const chipsFocusTests = pick(chipsSmokeTests, 2, 1);

const ChipsTests = [
	...chipsSmokeTests,
	...withConfig({focus: true}, chipsFocusTests)
];

export default ChipsTests;
