import spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {useEffect, useState} from 'react';

import Alert from '../../../../Alert';
import Button from '../../../../Button';
import ThemeDecorator from '../../../../ThemeDecorator';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const Container = SpotlightContainerDecorator('div');

const App = (props) => {
	const [open, setOpen] = useState(false);
	const [, setTick] = useState(0);

	useEffect(() => {
		// Patch Spotlight.add to count calls after mount.
		const original = spotlight.add.bind(spotlight);
		window.__spotlightAddCalls = 0;
		spotlight.add = (...args) => {
			window.__spotlightAddCalls += 1;
			return original(...args);
		};

		// 16ms ticker triggers frequent re-renders
		const id = setInterval(() => setTick((t) => t + 1), 16);

		return () => {
			spotlight.add = original;
			clearInterval(id);
		};
	}, []);

	return (
		<div id="alertMain" {...props}>
			<Button
				id="openOverlaySpotlightAdd"
				onClick={() => {
					spotlight.setPointerMode(true);
					setOpen(true);
				}}
			>
				Open Alert
			</Button>
			<Alert
				id="alertSpotlightAdd"
				open={open}
				type="overlay"
				onClose={() => setOpen(false)}
			>
				<div>Pointer Mode Test Alert</div>
				<Container>
					<Button id="buttonCancel" onClick={() => setOpen(false)}>Cancel</Button>
				</Container>
			</Alert>
		</div>
	);
};

export default ThemeDecorator(App);
