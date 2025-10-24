import * as React from 'react';
import Button from '@enact/limestone/Button';
import {Panel, Header} from '@enact/limestone/Panels';

const MainPanel = props => {
	const [slot, toggleSlot] = React.useState(false);
	const [centered, toggleCentered] = React.useState(false);
	const [noCloseButton, toggleNoCloseButton] = React.useState(false);
	const handleClick1 = React.useCallback(() => {
		toggleSlot(state => !state);
	}, []);
	const handleClick2 = React.useCallback(() => {
		toggleCentered(state => !state);
	}, []);
	const handleClick3 = React.useCallback(() => {
		toggleNoCloseButton(state => !state);
	}, []);

	return (
		<Panel {...props}>
			<Header title="Hello world" centered={centered} noCloseButton={noCloseButton}>
				{slot && (
					<slotAfter>
						<Button icon="arrowcurveright" />
					</slotAfter>
				)}
			</Header>
			<Button onClick={handleClick1}>{slot ? 'Hide slot' : 'Show slot'} Slot After</Button>
			<Button onClick={handleClick2}>{centered ? 'Make not centered' : 'Make centered'} Slot After</Button>
			<Button onClick={handleClick3}>{noCloseButton ? 'Hide  Close Button' : 'Show  Close Button'} Slot After</Button>
		</Panel>
	);
};

export default MainPanel;