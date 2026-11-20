import {Alert} from '@enact/limestone/Alert';
import {Button} from '@enact/limestone/Button';
import {StarRatings} from '@enact/limestone/StarRatings';
import {Fragment, useCallback, useState} from 'react';

import Section from '../components/Section';

const StarRatingsView = () => {
	const [openOverlay, setOpenOverlay] = useState(false);
	const [openReadonlyOverlay, setOpenReadonlyOverlay] = useState(false);

	const handleOpen = useCallback(() => {
		setOpenOverlay((prevOpen) => !prevOpen);
	}, []);

	const handleOpenReadOnly = useCallback(() => {
		setOpenReadonlyOverlay((prevOpen) => !prevOpen);
	}, []);

	return (
		<Fragment>
			<Section horizontal title="Default">
				<StarRatings id="star-ratings-default" />
			</Section>
			<Section horizontal title="Disabled">
				<StarRatings id="star-ratings-disabled" disabled />
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
			<Section horizontal title="Readonly">
				<StarRatings id="star-ratings-readlonly" readOnly value={3.14} ratings={432} />
			</Section>
			<Section horizontal title="Readonly Overlay">
				<Button onClick={handleOpenReadOnly}>Open</Button>
				<Alert
					open={openReadonlyOverlay}
					noAlertRole
					type="overlay"
					onClose={handleOpenReadOnly}
				>
					<StarRatings id="star-ratings-readlonly-overlay" overlayMode readOnly value={3.14} ratings={432} />
				</Alert>
			</Section>
		</Fragment>
	);
};

export default StarRatingsView;
