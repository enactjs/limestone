import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import ForwardRef from '@enact/ui/ForwardRef';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import type {ReactNode} from 'react';

import {onlyUpdateForProps} from '../internal/util';
import Marquee from '../Marquee';

import css from './MediaTitle.module.less';

export interface MediaTitleBaseProps {
	id: string;
	children?: ReactNode;
	forwardRef?: EnactPropTypeShapes.ref;
	infoVisible?: boolean;
	title?: string | ReactNode;
	visible?: boolean;
}

/**
 * MediaTitle {@link limestone/VideoPlayer}.
 *
 * @class MediaTitle
 * @memberof limestone/VideoPlayer
 * @ui
 * @private
 */
const MediaTitleBase = kind({
	name: 'MediaTitle',

	_propTypes: {} as MediaTitleBaseProps,

	propTypes: /** @lends limestone/VideoPlayer.MediaTitle.prototype */ {
		/**
		 * DOM id for the component. Also define ids for the title and node wrapping the `children`
		 * in the forms `${id}_title` and `${id}_info`, respectively.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		id: PropTypes.string.isRequired,

		/**
		 * Anything supplied to `children` will be rendered. Typically, this will be informational
		 * badges indicating aspect ratio, audio channels, etc., but it could also be a description.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Forwards a reference to the MediaTitle component.
		 *
		 * @type {Object|Function}
		 * @private
		 */
		forwardRef: EnactPropTypes.ref,

		/**
		 * Control whether the children (infoComponents) are displayed.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		infoVisible: PropTypes.bool,

		/**
		 * A title string to identify the media's title.
		 *
		 * @type {String|Node}
		 * @public
		 */
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

		/**
		 * Setting this to false effectively hides the entire component. Setting it to `false` after
		 * the control has rendered causes a fade-out transition. Setting to `true` after or during
		 * the transition makes the component immediately visible again, without delay or transition.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		// This property uniquely defaults to true, because it doesn't make sense to have it false
		// and have the control be initially invisible, and is named "visible" to match the other
		// props (current and possible future). Having an `infoVisible` and a `hidden` prop seems weird.
		visible: PropTypes.bool
	},

	defaultProps: {
		infoVisible: false,
		visible: true
	},

	styles: {
		css,
		className: 'titleFrame'
	},

	computed: {
		childrenClassName: ({infoVisible, styler}) => styler.join(
			'infoComponents',
			infoVisible ? 'visible' : 'hidden'
		),
		className: ({visible, styler}) => styler.append(
			visible ? 'visible' : 'hidden'
		),
		titleClassName: ({infoVisible, styler}) => styler.join({
			title: true,
			infoVisible
		})
	},

	render: ({children, childrenClassName, id, forwardRef, title, titleClassName, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.infoVisible;
		delete restProps.visible;

		return (
			<div {...restProps} id={id} ref={forwardRef as any}>
				<Marquee id={`${id}_title`} className={titleClassName} marqueeOn="render">
					{title}
				</Marquee>
				<div id={`${id}_info`} className={childrenClassName}>  {/* tabIndex={-1} */}
					{children}
				</div>
			</div>
		);
	}
});

const MediaTitle = ForwardRef(
	onlyUpdateForProps(MediaTitleBase, ['children', 'title', 'infoVisible', 'visible'])
);

export default MediaTitle;
export {
	MediaTitle,
	MediaTitleBase
};
