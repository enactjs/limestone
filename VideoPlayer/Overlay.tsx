import kind from '@enact/core/kind';
import Touchable from '@enact/ui/Touchable';
import PropTypes from 'prop-types';
import type {ReactNode} from 'react';

import {onlyUpdateForProps} from '../internal/util';

import css from './VideoPlayer.module.less';

export interface OverlayBaseProps {
	bottomControlsVisible?: boolean;
	children?: ReactNode;
}

/**
 * Overlay {@link limestone/VideoPlayer}. This covers the Video piece of the
 * {@link limestone/VideoPlayer} to prevent unnecessary VideoPlayer repaints due to mouse-moves.
 * It also acts as a container for overlaid elements, like the {@link limestone/Spinner}.
 *
 * @class Overlay
 * @memberof limestone/VideoPlayer
 * @ui
 * @private
 */
const OverlayBase = kind({
	name: 'Overlay',

	_propTypes: {} as OverlayBaseProps,

	propTypes: /** @lends limestone/VideoPlayer.Overlay.prototype */ {
		bottomControlsVisible: PropTypes.bool,
		children: PropTypes.node
	},

	styles: {
		css,
		className: 'overlay'
	},

	computed: {
		className: ({bottomControlsVisible, styler}) => styler.append({['scrim']: bottomControlsVisible})
	},

	render: (props) => {
		const restProps = props as Record<string, any>;
		delete restProps.bottomControlsVisible;
		return <div {...restProps} />;
	}
});

const Overlay = onlyUpdateForProps(Touchable(OverlayBase), ['bottomControlsVisible', 'children']);

export default Overlay;
export {
	Overlay,
	OverlayBase
};
