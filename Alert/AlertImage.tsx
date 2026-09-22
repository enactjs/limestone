import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import Image from '../Image';
import componentCss from './AlertImage.module.less';

export interface AlertImageProps {
	src: string | Record<string, string>;
	type: 'icon' | 'thumbnail';
	css?: Record<string, string>;
	iconSize?: 'small' | 'large';
}

/**
 * An image for use in an Alert.
 *
 * @class
 * @memberof limestone/Alert
 * @ui
 * @public
 */
const AlertImage = kind({
	name: 'AlertImage',

	_propTypes: {} as AlertImageProps,

	propTypes: /** @lends limestone/Alert.AlertImage.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `alertImage` - The root class name
		 *
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,

		/**
		 * Size of the image when `type` is set to `icon`.
		 *
		 *
		 * @type {('small'|'large')}
		 * @public
		 * @default 'large'
		 */
		iconSize: PropTypes.oneOf(['small', 'large']) as PropTypes.Validator<'small' | 'large' | undefined>,

		/**
		 * String value or Object of values used to determine which image will appear for
		 * a specific component size.
		 *
		 * @type {String|Object}
		 * @required
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired as PropTypes.Validator<string | Record<string, string>>,

		/**
		 * Type of image to appear in the alert component. There are two types:
		 *
		 * * `icon` - A small square sized image type
		 * * `thumbnail` - A common image type
		 *
		 * @type {('icon'|'thumbnail')}
		 * @required
		 * @public
		 */
		type: PropTypes.oneOf(['icon', 'thumbnail']).isRequired as PropTypes.Validator<'icon' | 'thumbnail'>
	},

	defaultProps: {
		iconSize: 'large'
	},

	styles: {
		className: 'alertImage',
		css: componentCss,
		publicClassNames: ['alertImage', 'icon', 'thumbnail']
	},

	computed: {
		className: ({iconSize, type, styler}) => styler.append(iconSize, type)
	},

	render: ({css, src, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.type;
		delete restProps.iconSize;

		return (
			<Image
				{...restProps}
				src={src}
				css={css}
			/>
		);
	}
});

export default AlertImage;
