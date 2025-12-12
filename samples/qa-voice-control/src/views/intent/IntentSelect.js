import Button from '@enact/limestone/Button';
import Card from '@enact/limestone/Card';
import Heading from '@enact/limestone/Heading';
import Item from '@enact/limestone/Item';
import {useState} from 'react';

import CommonView from '../../components/CommonView';

const IntentSelect = () => {
	const [result, setResult] = useState('');

	const updateResult = (msg) => setResult(msg);

	const handleClick = (msg) => () => updateResult(msg);

	const src =	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300' width='300' height='300'%3E%3Crect width='300' height='300' fill='%230084ff'%3E%3C/rect%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='36px' fill='%23ffffff'%3E300 X 300%3C/text%3E%3C/svg%3E";

	return (
		<CommonView title="Intent to select" subtitle={result}>
			<Heading showLine>Button</Heading>
			<Button onClick={handleClick('Button | 사진 필터')}>사진 필터</Button>
			<Heading showLine>IconButton</Heading>
			<Button data-webos-voice-label="별" tooltipText="별" onClick={handleClick('IconButton | 별')} icon="star" />
			<Heading showLine>Card</Heading>
			<Card data-webos-voice-label="카드" onClick={handleClick('Card | 카드')} src={src}>카드</Card>
			<Heading showLine>Item</Heading>
			<Item onClick={handleClick('Item | 다크 나이트')}>다크 나이트</Item>
		</CommonView>
	);
};

export default IntentSelect;
