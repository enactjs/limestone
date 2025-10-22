import {Chip, Chips} from '@enact/limestone/Chips';

import Section from '../components/Section';

const ChipView = () => (
	<>
		<Section title="Default">
			<Chips alt="Normal">
				<Chip deleteButton={{icon: 'closex', position: 'right'}}>Text 0</Chip>
			</Chips>
			<Chips alt="Disabled">
				<Chip deleteButton={{icon: 'closex', position: 'right'}} disabled>Text 1</Chip>
			</Chips>
		</Section>
	</>
);

export default ChipView;
