import Button from '@enact/limestone/Button';
import Heading from '@enact/limestone/Heading';
import {InputField, InputPopup, InputPopupBase} from '@enact/limestone/Input';
import {Panel, Header} from '@enact/limestone/Panels';
import {useCallback, useState} from 'react';

const MainView = () => {
	const [openInputPopup, setOpenInputPopup] = useState(false);
	const [openInputPopupBase, setOpenInputPopupBase] = useState(false);
	const [defaultValue, setDefaultValue] = useState('default');

	const handleOnChangeDefaultValue = useCallback(({value}) => {
		setDefaultValue(value);
	}, []);

	const handleOnClickInputPopup = useCallback(() => {
		setOpenInputPopup(prev => !prev);
	}, []);

	const handleOnClickInputPopupBase = useCallback(() => {
		setOpenInputPopupBase(prev => !prev);
	}, []);

	return (
		<Panel>
			<Header title="InputPopup QA-Sampler" />
			<Heading>defaultValue for the InputPopup</Heading>
			<InputField defaultValue={defaultValue} onChange={handleOnChangeDefaultValue} placeholder="Enter default value" />
			<Button onClick={handleOnClickInputPopup}>Open InputPopup</Button>
			<Button onClick={handleOnClickInputPopupBase}>Open InputPopupBase</Button>
			<InputPopup defaultValue={defaultValue} onClose={handleOnClickInputPopup} open={openInputPopup} />
			<InputPopupBase defaultValue={defaultValue} onClose={handleOnClickInputPopupBase} open={openInputPopupBase} />
		</Panel>
	);
};

export default MainView;
