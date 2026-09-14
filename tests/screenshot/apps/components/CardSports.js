import CardSports from '../../../../CardSports';
import Icon from '../../../../Icon';
import Image from '../../../../Image';

import img from '../../images/600x600.png';

const iconBadge = <Icon>ai</Icon>;
const imageBadge = <Image src={img} />;

const CardSportsTests = [
	<CardSports captionImageIconsSrc={[img, img, img, img]} hasContainer label="Description Label" leftTeam={{backgroundColor: '#1b2a4a', logo: imageBadge, score: '0/0'}} primaryBadge={iconBadge} rightTeam={{backgroundColor: '#e31c23', logo: imageBadge, score: '0/0'}} roundedImage secondaryBadge={imageBadge}>Item Label</CardSports>,
	<CardSports captionImageIconsSrc={[img, img, img, img]} hasContainer label="Description Label" leftTeam={{backgroundColor: '#1b2a4a', logo: imageBadge, score: '0/0'}} primaryBadge={iconBadge} rightTeam={{backgroundColor: '#e31c23', logo: imageBadge, score: '0/0'}} roundedImage secondaryBadge={imageBadge} selected>Item Label</CardSports>
];

export default CardSportsTests;
