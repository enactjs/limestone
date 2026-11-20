import {Alert} from '@enact/limestone/Alert';
import {Button} from '@enact/limestone/Button';
import {StarRatings} from '@enact/limestone/StarRatings';
import {Fragment, useCallback, useState} from 'react';

import Section from '../components/Section';

const StarRatingsView = () => {
	const [open, setOpen] = useState(false);

	const handleOpen = useCallback(() => {
		setOpen((prevOpen) => !prevOpen);
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
					open={open}
					noAlertRole
					type="overlay"
					onClose={handleOpen}
				>
					<StarRatings id="star-ratings-overlay" overlayMode />
				</Alert>
			</Section>
			<Section horizontal title="Readonly">
				<StarRatings id="star-ratings-readlonly" readOnly value={3.14} ratings={123} />
			</Section>
		</Fragment>
	);
};

export default StarRatingsView;
