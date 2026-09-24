import kind from '@enact/core/kind';
import {Knob} from '@enact/ui/Slider';
import PropTypes from 'prop-types';

export interface MediaKnobProps {
	preview?: boolean;
	previewProportion?: number;
	value?: number;
}

/**
 * Knob for the MediaSlider in {@link limestone/MediaPlayer}.
 *
 * @class MediaKnob
 * @memberof limestone/MediaPlayer
 * @ui
 * @private
 */
const MediaKnob = kind({
	name: 'MediaKnob',

	_propTypes: {} as MediaKnobProps,

	propTypes: {
		preview: PropTypes.bool,
		previewProportion: PropTypes.number,
		value: PropTypes.number
	},

	computed: {
		style: ({style, preview, previewProportion}: any) => {
			if (!preview) {
				return style;
			}

			return {
				...style,
				'--ui-slider-proportion-end-knob': previewProportion
			};
		}
	},

	render: ({preview, previewProportion, value, ...rest}) => {
		if (preview) {
			value = previewProportion;
		}

		const knobProps: any = {
			...rest,
			proportion: value,
			value
		};

		return (
			<Knob
				{...knobProps}
			/>
		);
	}
});

export default MediaKnob;
export {
	MediaKnob
};
