// import Chip from '@enact/limestone/Chip';
import Chip from '@enact/limestone/Chips/Chip';

import Section from '../components/Section';

const ChipView = () => (
	<>
		<Section title="Default">
			<Chip alt="Normal" deleteButton={{icon: 'closex', position: 'right'}}>Text 0</Chip>
			<Chip alt="Disabled" deleteButton={{icon: 'closex', position: 'right'}} disabled>Text 1</Chip>
		</Section>
	</>
);

export default ChipView;
