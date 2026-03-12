import {Chip, Chips} from '@enact/limestone/Chips';

import Section from '../components/Section';

const ChipsView = () => (
	<>
		<Section horizontal title="Default">
			<Chips>
				<Chip deleteButton={{icon: 'closex', position: 'right'}}>Text 0</Chip>
				<Chip deleteButton={{icon: 'closex', position: 'right'}}>Text 1</Chip>
				<Chip deleteButton={{icon: 'closex', position: 'right'}}>Text 2</Chip>
			</Chips>
		</Section>
		<Section horizontal title="Checked">
			<Chips>
				<Chip deleteButton={{icon: 'closex', position: 'right'}} checked>Text 0</Chip>
				<Chip deleteButton={{icon: 'closex', position: 'right'}} checked>Text 1</Chip>
				<Chip deleteButton={{icon: 'closex', position: 'right'}} checked>Text 2</Chip>
			</Chips>
		</Section>
		<Section horizontal title="Disabled">
			<Chips>
				<Chip deleteButton={{icon: 'closex', position: 'right'}} disabled>Text 0</Chip>
				<Chip deleteButton={{icon: 'closex', position: 'right'}} disabled>Text 1</Chip>
				<Chip deleteButton={{icon: 'closex', position: 'right'}} disabled>Text 2</Chip>
			</Chips>
		</Section>
	</>
);

export default ChipsView;
