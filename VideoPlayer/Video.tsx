import {forward} from '@enact/core/handle';
import ForwardRef from '@enact/ui/ForwardRef';
import {Media, getKeyFromSource} from '@enact/ui/Media';
import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import Slottable from '@enact/ui/Slottable';
import compose from 'ramda/src/compose';
import {isValidElement, Component, Fragment} from 'react';
import type {ComponentType} from 'react';

import css from './VideoPlayer.module.less';

import PropTypes from 'prop-types';

export interface VideoBaseProps {
	autoPlay?: boolean;
	mediaComponent?: EnactPropTypeShapes.renderableOverride;
	preloadSource?: any;
	setMedia?: (...args: any[]) => any;
	source?: any;
	[key: string]: any;
}

/**
 * Adds support for preloading a video source for `VideoPlayer`.
 *
 * @class VideoBase
 * @memberof limestone/VideoPlayer
 * @ui
 * @private
 */
const VideoBase = class extends Component<VideoBaseProps> {
	static displayName = 'Video';

	static propTypes = /** @lends limestone/VideoPlayer.Video.prototype */ {
		autoPlay: PropTypes.bool,
		mediaComponent: EnactPropTypes.renderableOverride as PropTypes.Validator<EnactPropTypeShapes.renderableOverride | undefined>,
		preloadSource:  PropTypes.node,
		setMedia: PropTypes.func,
		source: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
	};

	static defaultProps = {
		mediaComponent: 'video'
	};

	componentDidUpdate (prevProps: VideoBaseProps) {
		const {source, preloadSource} = this.props;
		const {source: prevSource, preloadSource: prevPreloadSource} = prevProps;

		const key = getKeyFromSource(source);
		const prevKey = getKeyFromSource(prevSource);
		const preloadKey = getKeyFromSource(preloadSource);
		const prevPreloadKey = getKeyFromSource(prevPreloadSource);

		if (this.props.setMedia !== prevProps.setMedia) {
			this.clearMedia(prevProps);
			this.setMedia();
		}

		if (source) {
			if (key === prevPreloadKey && preloadKey !== prevPreloadKey) {
				// if there's source and it was the preload source

				// if the preloaded video didn't error, notify VideoPlayer it is ready to reset
				if (this.preloadLoadStart) {
					forward('onLoadStart', this.preloadLoadStart, this.props);
				}

				// emit onUpdate to give VideoPlayer an opportunity to updates its internal state
				// since it won't receive the onLoadStart or onError event
				forward('onUpdate', {type: 'onUpdate'}, this.props);

				this.autoPlay();
			} else if (key !== prevKey) {
				// if there's source and it has changed.
				this.autoPlay();
			}
		}

		if (preloadSource && preloadKey !== prevPreloadKey) {
			this.preloadLoadStart = null;

			// In the case that the previous source equalled the previous preload (causing the
			// preload video node to not be created) and then the preload source was changed, we
			// need to guard against accessing the preloadVideo node.
			if (this.preloadVideo) {
				this.preloadVideo.load();
			}
		}
	}

	componentWillUnmount () {
		this.clearMedia();
	}

	video: any;
	preloadVideo: any;
	preloadLoadStart: any;

	keys = ['media-1', 'media-2'];
	prevSourceKey: any = null;
	prevPreloadKey: any = null;

	handlePreloadLoadStart = (ev: any) => {
		// persist the event so we can cache it to re-emit when the preload becomes active
		ev.persist();
		this.preloadLoadStart = ev;

		// prevent the from bubbling to upstream handlers
		ev.stopPropagation();
	};

	clearMedia ({setMedia}: Partial<VideoBaseProps> = this.props) {
		if (setMedia) {
			setMedia(null);
		}
	}

	setMedia ({setMedia}: Partial<VideoBaseProps> = this.props) {
		if (setMedia) {
			setMedia(this.video);
		}
	}

	autoPlay () {
		if (!this.props.autoPlay) return;

		const playPromise = this.video.play();

		if (playPromise) {
			playPromise.then(() => {
				// Autoplay started
			}).catch(() => {
				// Autoplay was prevented
			});
		}
	}

	setVideoRef = (node: any) => {
		this.video = node;
		this.setMedia();
	};

	setPreloadRef = (node: any) => {
		if (node) {
			node.load();
		}
		this.preloadVideo = node;
	};

	getKeys () {
		const {source, preloadSource} = this.props;

		const sourceKey = source && getKeyFromSource(source);
		let preloadKey = preloadSource && getKeyFromSource(preloadSource);

		// If the same source is used for both, clear the preload key to avoid rendering duplicate
		// video elements.
		if (sourceKey === preloadKey) {
			preloadKey = null;
		}

		// if either the source or preload existed previously in the other "slot", swap the keys so
		// the preload video becomes the active video and vice versa
		if (
			(sourceKey === this.prevPreloadKey && this.prevPreloadKey) ||
			(preloadKey === this.prevSourceKey && this.prevSourceKey)
		) {
			this.keys.reverse();
		}

		// cache the previous keys so we know if the sources change the next time
		this.prevSourceKey = sourceKey;
		this.prevPreloadKey = preloadKey;

		// if preload is unset, clear the key so we don't render that media node at all
		return preloadKey ? this.keys : this.keys.slice(0, 1);
	}

	render () {
		const {
			preloadSource,
			source,
			mediaComponent,
			...rest
		} = this.props;

		const restProps = rest as Record<string, any>;
		delete restProps.setMedia;

		const [sourceKey, preloadKey] = this.getKeys();

		return (
			<Fragment>
				{sourceKey ? (
					<Media
						{...restProps}
						className={css.video}
						controls={false}
						key={sourceKey}
						mediaComponent={mediaComponent}
						preload="none"
						ref={this.setVideoRef}
						source={isValidElement(source) ? source : (
							<source src={source} />
						)}
					/>
				) : null}
				{preloadKey ? (
					<Media
						autoPlay={false}
						className={css.preloadVideo}
						controls={false}
						key={preloadKey}
						mediaComponent={mediaComponent}
						onLoadStart={this.handlePreloadLoadStart}
						preload="none"
						ref={this.setPreloadRef}
						source={isValidElement(preloadSource) ? preloadSource : (
							<source src={preloadSource} />
						)}
					/>
				) : null}
			</Fragment>
		);
	}
};

const VideoDecorator = compose(
	ForwardRef({prop: 'setMedia'}),
	Slottable({slots: ['source', 'preloadSource']})
);

/**
 * Provides support for more advanced video configurations for `VideoPlayer`.
 *
 * @class Video
 * @mixes ui/Slottable.Slottable
 * @memberof limestone/VideoPlayer
 * @ui
 * @public
 */
const Video = VideoDecorator(VideoBase) as ComponentType<any>;
(Video as any).defaultSlot = 'videoComponent';

export default Video;
export {
	Video
};
