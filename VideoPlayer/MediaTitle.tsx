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
		id: PropTypes.string.isRequired,
		children: PropTypes.node,
		forwardRef: EnactPropTypes.ref,
		infoVisible: PropTypes.bool,
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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
