import Button from '@enact/limestone/Button';
import {InputField, InputPopup, InputPopupBase} from '@enact/limestone/Input';
import {Panel, Header} from '@enact/limestone/Panels';
import Heading from '@enact/limestone/Heading';
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

	const InputPopupWithDefaultValue = useCallback(() => {
		return <InputPopup defaultValue={defaultValue} onClose={handleOnChangeDefaultValue} open={openInputPopup} />;
	}, [defaultValue, handleOnChangeDefaultValue, openInputPopup]);

	const InputPopupBaseWithDefaultValue = useCallback(() => {
		return <InputPopupBase defaultValue={defaultValue} onClose={handleOnClickInputPopup} open={openInputPopupBase} />;
	}, [defaultValue, handleOnClickInputPopup, openInputPopupBase]);

	return (
		<Panel>
			<Header title="InputPopup QA-Sampler" />
			<Heading>defaultValue for the InputPopup</Heading>
			<InputField defaultValue={defaultValue} onChange={handleOnChangeDefaultValue} placeholder="Enter default value" />
			<Button onClick={handleOnClickInputPopup}>Open InputPopup</Button>
			<Button onClick={handleOnClickInputPopupBase}>Open InputPopupBase</Button>
			<InputPopupWithDefaultValue />
			<InputPopupBaseWithDefaultValue />
		</Panel>
	);
};

export default MainView;
