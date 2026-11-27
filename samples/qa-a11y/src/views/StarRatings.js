import {Alert} from '@enact/limestone/Alert';
import {Button} from '@enact/limestone/Button';
import {StarRatings} from '@enact/limestone/StarRatings';
import {Fragment, useCallback, useState} from 'react';

import Section from '../components/Section';

const StarRatingsView = () => {
	const [openOverlay, setOpenOverlay] = useState(false);

	const handleOpen = useCallback(() => {
		setOpenOverlay((prevOpen) => !prevOpen);
	}, []);

	return (
		<Fragment>
			<Section horizontal title="Default">
				<StarRatings id="star-ratings-default" />
			</Section>
			<Section horizontal title="Disabled">
				<StarRatings id="star-ratings-disabled" disabled />
			</Section>
			<Section horizontal title="Changed max">
				<StarRatings readOnly id="star-ratings-changed-max" max={7} value={5} />
			</Section>
			<Section horizontal title="Custom aria-label">
				<StarRatings id="star-ratings-custom-aria-label" aria-label="Custom aria-label" />
			</Section>
			<Section horizontal title="Overlay">
				<Button onClick={handleOpen}>Open</Button>
				<Alert
					open={openOverlay}
					noAlertRole
					type="overlay"
					onClose={handleOpen}
				>
					<StarRatings id="star-ratings-overlay" overlayMode />
				</Alert>
			</Section>
		</Fragment>
	);
};

export default StarRatingsView;
