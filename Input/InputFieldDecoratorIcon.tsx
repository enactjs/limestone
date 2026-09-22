import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import type {ReactElement} from 'react';

import Icon from '../Icon';
import {onlyUpdateForProps} from '../internal/util';

export interface InputDecoratorIconBaseProps {
	position: 'before' | 'after';
	children?: string | Record<string, string> | ReactElement;
}

/**
 * The stateless functional base component for {@link limestone/Input.InputDecoratorIcon}.
 *
 * @class InputDecoratorIconBase
 * @memberof limestone/Input
 * @ui
 * @private
 */
const InputDecoratorIconBase = kind({
	name: 'InputDecoratorIcon',

	_propTypes: {} as InputDecoratorIconBaseProps,

	propTypes: /** @lends limestone/Input.InputDecoratorIconBase.prototype */ {
		/**
		 * Icon to be displayed.
		 *
		 * @see {@link limestone/Icon.IconBase.children}
		 * @type {String|Object}
		 */
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]) as PropTypes.Validator<string | Record<string, string> | undefined>,

		/**
		 * The position of the icon.
		 *
		 * @type {('before'|'after')}
		 * @required
		 */
		position: PropTypes.oneOf(['before', 'after']).isRequired as PropTypes.Validator<'before' | 'after'>
	},

	render: ({children, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.position;

		return children ? (
			<Icon {...restProps} data-input-icon>{children}</Icon>
		) : null;
	}
});

/**
 * An icon displayed either before or after the input field of an {@link limestone/Input.Input}.
 *
 * @class InputDecoratorIcon
 * @memberof limestone/Input
 * @ui
 * @private
 */
const InputDecoratorIcon = onlyUpdateForProps(InputDecoratorIconBase, ['children', 'size']);

export default InputDecoratorIcon;
export {
	InputDecoratorIcon,
	InputDecoratorIconBase
};
