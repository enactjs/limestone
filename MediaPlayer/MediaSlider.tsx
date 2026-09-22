import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import type {ComponentType} from 'react';

import Slider from '../Slider';

import MediaKnob from './MediaKnob';
import MediaSliderDecorator from './MediaSliderDecorator';

import css from './MediaSlider.module.less';

export interface MediaSliderBaseProps {
	forcePressed?: boolean;
	preview?: boolean;
	previewProportion?: number;
	visible?: boolean;
}

/**
 * The base component to render a customized {@link limestone/Slider.Slider|Slider} for use in
 * media player components such as {@link limestone/VideoPlayer.VideoPlayer|VideoPlayer}.
 *
 * @class MediaSliderBase
 * @memberof limestone/MediaPlayer
 * @ui
 * @private
 */
const MediaSliderBase = kind({
	name: 'MediaSlider',

	_propTypes: {} as MediaSliderBaseProps,

	propTypes: /** @lends limestone/MediaPlayer.MediaSlider.prototype */ {
		forcePressed: PropTypes.bool,
		preview: PropTypes.bool,
		previewProportion: PropTypes.number,
		visible: PropTypes.bool
	},

	defaultProps: {
		preview: false,
		visible: true
	},

	styles: {
		css,
		className: 'sliderFrame'
	},

	computed: {
		className: ({styler, visible}) => styler.append({hidden: !visible}),
		sliderClassName: ({styler, forcePressed}) => styler.join({
			pressed: forcePressed,
			mediaSlider: true
		})
	},

	render: ({className, preview, previewProportion, sliderClassName, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.forcePressed;
		delete restProps.visible;

		return (
			<div className={className}>
				<Slider
					{...restProps}
					aria-hidden="true"
					className={sliderClassName}
					css={css}
					knobComponent={
						<MediaKnob preview={preview} previewProportion={previewProportion} />
					}
					max={1}
					min={0}
					noWheel
					step={0.00001}
				/>
			</div>
		);
	}
});

/**
 * A customized slider suitable for use within media player components such as
 * {@link limestone/VideoPlayer.VideoPlayer|VideoPlayer}.
 *
 * @class MediaSlider
 * @extends limestone/Slider.Slider
 * @memberof limestone/MediaPlayer
 * @ui
 * @public
 */
const MediaSlider = MediaSliderDecorator(MediaSliderBase) as ComponentType<any>;

export default MediaSlider;
export {
	MediaSlider,
	MediaSliderBase
};
