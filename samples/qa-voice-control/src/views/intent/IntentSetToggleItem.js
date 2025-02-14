import Heading from '@enact/limestone/Heading';
import SwitchItem from '@enact/limestone/SwitchItem';

import CommonView from '../../components/CommonView';

const IntentSetToggleItem = () => {
	return (
		<CommonView title="Intent to set ToggleItem">
			<Heading>SwitchItem</Heading>
			<SwitchItem data-testid="hello">Hello</SwitchItem>
		</CommonView>
	);
};

export default IntentSetToggleItem;
