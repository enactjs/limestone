import kind from '@enact/core/kind';
import BodyText from '@enact/limestone/BodyText';
import Button from '@enact/limestone/Button';
import {Column} from '@enact/ui/Layout';
import {Panel, Header} from '@enact/limestone/Panels';

import {buttonColors, containerColors} from '../colorsConfig';

const MainPanel = kind({
	name: 'MainPanel',

	render: (props) => (
		<Panel {...props}>
			<Header title="Color Customization Tutorial" />
			<BodyText>Focus the buttons to see the difference in colors</BodyText>
			<Button>Button changed from root</Button>
			<Column style={containerColors}>
				<Button>Button changed from container</Button>
				<Button style={buttonColors} >Button changed from component</Button>
			</Column>
		</Panel>
	)
});

export default MainPanel;
