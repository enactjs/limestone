import kind from '@enact/core/kind';
import {checkPropTypes} from '@enact/core/util';
import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';

const DivComponent = (props: Record<string, any>) => {
	checkPropTypes(DivComponent, props);
	const {innerRef, ...rest} = props;

	return (<div {...rest} ref={innerRef} />);
};

DivComponent.propTypes = {
	innerRef: EnactPropTypes.ref
};

const Div = Spottable(DivComponent);

export interface SpottablePickerBaseProps {
	changedBy?: 'enter' | 'arrow';
	containerRef?: EnactPropTypeShapes.ref;
	disabled?: boolean;
	pickerOrientation?: string;
}

const SpottablePicker = kind({
	name: 'SpottablePicker',

	_propTypes: {} as SpottablePickerBaseProps,

	propTypes: {
		changedBy: PropTypes.oneOf(['enter', 'arrow']),
		containerRef: EnactPropTypes.ref as PropTypes.Validator<EnactPropTypeShapes.ref | undefined>,
		disabled: PropTypes.bool,
		pickerOrientation: PropTypes.string
	},

	computed: {
		selectionKeys: ({changedBy, disabled, pickerOrientation}) => {
			if (disabled || (pickerOrientation === 'horizontal' && changedBy === 'enter')) return;

			return pickerOrientation === 'horizontal' ? [37, 39] : [38, 40];
		}
	},

	render: ({containerRef, selectionKeys, ...rest}) => {
		delete rest.changedBy;
		delete rest.pickerOrientation;

		return (
			<Div innerRef={containerRef} {...rest} selectionKeys={selectionKeys} />
		);
	}
});

export default SpottablePicker;
export {
	SpottablePicker
};
