import kind from '@enact/core/kind';
import {checkPropTypes} from '@enact/core/util';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';

import type {TypedKindComponent} from '../kindComponent.type';

const DivComponent = (props: Record<string, any>) => {
	checkPropTypes(DivComponent, props);
	const {innerRef, ...rest} = props;

	return (<div {...rest} ref={innerRef} />);
};

DivComponent.propTypes = {
	innerRef: EnactPropTypes.ref
};

const Div = Spottable(DivComponent);

const SpottablePicker = kind({
	name: 'SpottablePicker',

	propTypes: {
		changedBy: PropTypes.oneOf(['enter', 'arrow']),
		containerRef: EnactPropTypes.ref,
		disabled: PropTypes.bool,
		pickerOrientation: PropTypes.string
	},

	computed: {
		selectionKeys: ({changedBy, disabled, pickerOrientation}: Record<string, any>) => {
			if (disabled || (pickerOrientation === 'horizontal' && changedBy === 'enter')) return;

			return pickerOrientation === 'horizontal' ? [37, 39] : [38, 40];
		}
	},

	render: ({containerRef, selectionKeys, ...rest}: Record<string, any>) => {
		delete rest.changedBy;
		delete rest.pickerOrientation;

		return (
			<Div innerRef={containerRef} {...rest} selectionKeys={selectionKeys} />
		);
	}
}) as TypedKindComponent<Record<string, any>>;

export default SpottablePicker;
export {
	SpottablePicker
};
