/**
 * Provides a media component with image and text overlay support.
 *
 * @example
 * <MediaOverlay text="overlay">
 *   <source src="https://media.w3.org/2010/05/sintel/trailer.mp4" />
 * </MediaOverlay>
 *
 * @module limestone/MediaOverlay
 * @exports MediaOverlay
 * @exports MediaOverlayBase
 * @exports MediaOverlayDecorator
 */

import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import {Layout, Cell} from '@enact/ui/Layout';
import Media from '@enact/ui/Media';
import Touchable from '@enact/ui/Touchable';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import type {ComponentType, ReactNode} from 'react';

import Image from '../Image';
import {Marquee, MarqueeController} from '../Marquee';
import ProgressBar from '../ProgressBar';
import Skinnable from '../Skinnable';

import componentCss from './MediaOverlay.module.less';

export interface MediaOverlayBaseProps {
	source: ReactNode;
	caption?: ReactNode;
	css?: Record<string, string>;
	imageOverlay?: string | Record<string, string>;
	loop?: boolean;
	marqueeOn?: 'focus' | 'hover' | 'render';
	mediaComponent?: EnactPropTypeShapes.renderable;
	muted?: boolean;
	noAutoPlay?: boolean;
	placeholder?: string;
	pressed?: boolean;
	progress?: number;
	showProgress?: boolean;
	subtitle?: string;
	text?: string;
	textAlign?: 'center' | 'end' | 'start';
	title?: string;
}

/**
 * A media component with image and text overlay support.
 *
 * @class MediaOverlayBase
 * @memberof limestone/MediaOverlay
 * @ui
 * @public
 */
const MediaOverlayBase = kind({
	name: 'MediaOverlay',

	_propTypes: {} as MediaOverlayBaseProps,

	propTypes: /** @lends limestone/MediaOverlay.MediaOverlayBase.prototype */ {
		source: PropTypes.node.isRequired,

		caption: PropTypes.node,

		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,

		imageOverlay: PropTypes.oneOfType([PropTypes.string, PropTypes.object]) as PropTypes.Validator<string | Record<string, string> | undefined>,

		loop: PropTypes.bool,

		marqueeOn: PropTypes.oneOf(['focus', 'hover', 'render']) as PropTypes.Validator<'focus' | 'hover' | 'render' | undefined>,

		mediaComponent: EnactPropTypes.renderable as PropTypes.Validator<EnactPropTypeShapes.renderable | undefined>,

		muted: PropTypes.bool,

		noAutoPlay: PropTypes.bool,

		placeholder: PropTypes.string,

		pressed: PropTypes.bool,

		progress: PropTypes.number,

		showProgress: PropTypes.bool,

		subtitle: PropTypes.string,

		text: PropTypes.string,

		textAlign: PropTypes.oneOf(['center', 'end', 'start']) as PropTypes.Validator<'center' | 'end' | 'start' | undefined>,

		title: PropTypes.string
	},

	defaultProps: {
		mediaComponent: 'video',
		pressed: false,
		progress: 0,
		textAlign: 'end'
	},

	styles: {
		css: componentCss,
		className: 'mediaOverlay',
		publicClassNames: ['mediaOverlay', 'image', 'pressed', 'text']
	},

	computed: {
		className: ({pressed, styler}) => styler.append({pressed})
	},

	render: ({caption, css, imageOverlay, loop, marqueeOn, mediaComponent, muted, noAutoPlay, placeholder, progress, showProgress, source, title, subtitle, text, textAlign, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.pressed;

		return (
			<div {...restProps}>
				<div className={css!.bg} />
				<div className={css!.mediaContainer}>
					<Media
						autoPlay={!noAutoPlay}
						className={css!.media}
						controls={false}
						loop={loop}
						mediaComponent={mediaComponent}
						muted={muted}
						source={source}
					/>
					{imageOverlay ? (
						<Image
							className={css!.image}
							placeholder={placeholder}
							sizing="fill"
							src={imageOverlay}
						/>
					) : null}
					{text ? (
						<Layout align={textAlign} className={css!.textLayout}>
							<Cell
								{...({
									component: Marquee,
									alignment: 'center',
									className: css!.text,
									marqueeOn
								} as any)}
							>
								{text}
							</Cell>
						</Layout>
					) : null}
					{showProgress ?
						<ProgressBar
							css={css}
							orientation="horizontal"
							progress={progress}
						/> : null
					}
				</div>
				<div className={css!.captionContainer}>
					{caption ? (
						<Marquee className={css!.caption} marqueeOn={marqueeOn}>{caption}</Marquee>
					) : null}
					{title ? (
						<Marquee className={css!.title} marqueeOn={marqueeOn}>{title}</Marquee>
					) : null}
					{subtitle ? (
						<Marquee className={css!.subtitle} marqueeOn={marqueeOn}>{subtitle}</Marquee>
					) : null}
				</div>
			</div>
		);
	}
});

/**
 * A higher-order component that adds Limestone specific behaviors to `MediaOverlay`.
 *
 * @hoc
 * @memberof limestone/MediaOverlay
 * @mixes limestone/Marquee.MarqueeController
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Slottable.Slottable
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const MediaOverlayDecorator = compose(
	MarqueeController({marqueeOnFocus: true}),
	Pure,
	Touchable({activeProp: 'pressed'}),
	Spottable,
	Slottable({slots: ['source']}),
	Skinnable
);

/**
 * A Limestone-styled `Media` component.
 *
 * @class MediaOverlay
 * @memberof limestone/MediaOverlay
 * @extends limestone/MediaOverlay.MediaOverlayBase
 * @mixes limestone/MediaOverlay.MediaOverlayDecorator
 * @ui
 * @public
 */
const MediaOverlay = MediaOverlayDecorator(MediaOverlayBase) as ComponentType<MediaOverlayBaseProps>;

export default MediaOverlay;
export {
	MediaOverlay,
	MediaOverlayBase,
	MediaOverlayDecorator
};
