import CheckboxItem from '@enact/limestone/CheckboxItem';

const ScrollerSwitch = ({title, ...rest}) => {
	return (
		<CheckboxItem {...rest}>
			{title}
		</CheckboxItem>
	);
};

export default ScrollerSwitch;
export {ScrollerSwitch};
