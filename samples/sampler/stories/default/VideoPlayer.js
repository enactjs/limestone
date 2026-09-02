import Button from '@enact/limestone/Button';
import {ImageItem} from '@enact/limestone/ImageItem';
import {MediaControls} from '@enact/limestone/MediaPlayer';
import VideoPlayer, {VideoPlayerBase} from '@enact/limestone/VideoPlayer';
import {VirtualGridList} from '@enact/limestone/VirtualList';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, range, select, text} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';

import icons from '../helper/icons';
import {svgGenerator} from '../helper/svg';

const items = [];
const size = 20;

const renderItem = ({index, ...rest}) => {
	const {source} = items[index];

	return <ImageItem {...rest} src={source} />;
};

const updateDataSize = (dataSize) => {
	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		const color = Math.floor(Math.random() * (0x1000000 - 0x101010) + 0x101010).toString(16),
			source = svgGenerator(300, 300, color, 'ffffff', `Image ${i}`);
		items.push({source});
	}

	return dataSize;
};

updateDataSize(size);

// Set up some defaults for info and controls
const prop = {
	moreButtonColor: ['', 'red', 'green', 'yellow', 'blue'],
	videoTitles: ['Big Buck Bunny', 'Cosmos Laundromat', 'Elephants Dream', 'Bad Video Source'],
	videos: {
		// Big Buck Bunny (CC BY 3.0) - Blender Foundation, https://www.blender.org
		'Big Buck Bunny': 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
		// Cosmos Laundromat (CC BY 4.0) - Blender Foundation, https://www.blender.org
		'Cosmos Laundromat': 'https://media.xiph.org/cosmoslaundromat/Pilot_Trailer_Cosmos_Laundromat.mp4',
		// Elephants Dream (CC BY 3.0) - Blender Foundation, https://www.blender.org
		'Elephants Dream': 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
		// Purposefully not a video to demonstrate source error state
		'Bad Video Source': 'https://github.com/mderrick/react-html5video'
	},
	posters: {
		'Big Buck Bunny': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg',
		'Cosmos Laundromat': 'https://media.xiph.org/cosmoslaundromat/Cosmos_Laundromat_1-2k-png/07580.png',
		'Elephants Dream': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Elephants_Dream_s5_both.jpg',
		'Bad Video Source': ''
	},
	events: [
		'onAbort',
		'onBack',
		'onCanPlay',
		'onCanPlayThrough',
		'onControlsAvailable',
		'onDurationChange',
		'onEmptied',
		'onEncrypted',
		'onEnded',
		'onError',
		'onFastForward',
		'onJumpBackward',
		'onJumpForward',
		'onLoadedData',
		'onLoadedMetadata',
		'onLoadStart',
		'onPause',
		'onPlay',
		'onPlaying',
		'onProgress',
		'onRateChange',
		'onRewind',
		'onSeeked',
		'onSeekFailed',
		'onSeeking',
		'onStalled',
		'onSuspend',
		'onToggleMore',
		// 'onTimeUpdate',	// Disabled due to Storybook Actions-reporting having an adverse effect on VideoPlayer performance. Uncomment to view this event.
		'onVolumeChange',
		'onWaiting',
		'onWillFastForward',
		'onWillJumpBackward',
		'onWillJumpForward',
		'onWillPause',
		'onWillPlay',
		'onWillRewind'
	]
};

prop.eventActions = {};
prop.events.forEach((ev) => {
	prop.eventActions[ev] = action(ev);
});

const Config = mergeComponentMetadata('VideoPlayer', VideoPlayerBase, VideoPlayer);
const MediaControlsConfig = mergeComponentMetadata('MediaControls', MediaControls);
VideoPlayer.displayName = 'VideoPlayer';
MediaControls.displayName = 'MediaControls';

export default {
	title: 'Limestone/VideoPlayer',
	component: 'VideoPlayer'
};

export const _VideoPlayer = (args) => {
	const videoTitle = args['source'];
	const videoSource = prop.videos[videoTitle];
	const poster = prop.posters[videoTitle];

	const controls = {
		autoCloseTimeout: args['autoCloseTimeout'],
		backButtonAriaLabel: args['backButtonAriaLabel'],
		disabled: args['disabled'],
		feedbackHideDelay: args['feedbackHideDelay'],
		includeTimeHour: args['includeTimeHour'],
		initialJumpDelay: args['initialJumpDelay'],
		jumpDelay: args['jumpDelay'],
		loop: args['loop'],
		miniFeedbackHideDelay: args['miniFeedbackHideDelay'],
		muted: args['muted'],
		no5WayJump: args['no5WayJump'],
		noAutoPlay: args['noAutoPlay'],
		noAutoShowMediaControls: args['noAutoShowMediaControls'],
		noMediaSliderFeedback: args['noMediaSliderFeedback'],
		noMiniFeedback: args['noMiniFeedback'],
		noSlider: args['noSlider'],
		pauseAtEnd: args['pauseAtEnd'],
		seekDisabled: args['seekDisabled'],
		spotlightDisabled: args['spotlightDisabled'],
		thumbnailUnavailable: args['thumbnailUnavailable'],
		title: args['title'],
		titleHideDelay: args['titleHideDelay']
	};

	return (
		<div
			style={{
				transformOrigin: 'top',
				transform:
					'scale(' +
					args['video scale'] +
					')',
				outline: 'teal dashed 1px',
				height: '70vh',
				marginTop: ri.scaleToRem(96)
			}}
		>
			<label
				style={{
					outline: 'teal dashed 1px',
					backgroundColor: 'rgba(0, 128, 128, 0.5)',
					color: '#0bb',
					position: 'absolute',
					transform: 'translateY(-100%)',
					borderBottomWidth: 0,
					padding: '0.1em 1em',
					fontWeight: 100,
					fontStyle: 'italic',
					fontSize: ri.scaleToRem(32)
				}}
			>
				VideoPlayer Edge
			</label>
			<VideoPlayer
				{...controls}
				poster={poster}
				thumbnailSrc={poster}
				{...prop.eventActions}
			>
				<source src={videoSource} type="video/mp4" />
				<infoComponents>
					A video about some things happening to and around some characters. Very exciting stuff.
				</infoComponents>
				<MediaControls
					actionGuideButtonAriaLabel={args['actionGuideButtonAriaLabel']}
					actionGuideLabel={args['actionGuideLabel']}
					jumpBackwardAriaLabel={args['jumpBackwardAriaLabel']}
					jumpBackwardIcon={args['jumpBackwardIcon']}
					jumpButtonsDisabled={args['jumpButtonsDisabled']}
					jumpForwardAriaLabel={args['jumpForwardAriaLabel']}
					jumpForwardIcon={args['jumpForwardIcon']}
					noJumpButtons={args['noJumpButtons']}
					rateChangeDisabled={args['rateChangeDisabled']}
					moreActionDisabled={args['moreActionDisabled']}
					pauseIcon={args['pauseIcon']}
					playIcon={args['playIcon']}
					playPauseButtonDisabled={args['playPauseButtonDisabled']}
				>
					<bottomComponents>
						<VirtualGridList
							style={{height: ri.scale(324), marginTop: ri.scale(60)}}
							horizontalScrollbar={'hidden'}
							dataSize={size}
							direction="horizontal"
							itemSize={{
								minWidth: ri.scale(324),
								minHeight: ri.scale(324)
							}}
							itemRenderer={renderItem}
							spacing={ri.scale(12)}
							hoverToScroll
						/>
					</bottomComponents>
					<Button icon="list" />
					<Button icon="playspeed" />
					<Button icon="speakercenter" />
					<Button icon="miniplayer" />
					<Button icon="subtitle" />
				</MediaControls>
			</VideoPlayer>
		</div>
	);
};

select('source', _VideoPlayer, prop.videoTitles, Config, 'Big Buck Bunny');
range('video scale', _VideoPlayer, Config, {min: 0.05, max: 1, step: 0.01}, 1);
number('autoCloseTimeout', _VideoPlayer, Config, 7000);
text('backButtonAriaLabel', _VideoPlayer, Config, 'go to previous');
boolean('disabled', _VideoPlayer, Config);
number('feedbackHideDelay', _VideoPlayer, Config, 3000);
boolean('includeTimeHour', _VideoPlayer, Config);
number('initialJumpDelay', _VideoPlayer, Config, 400);
number('jumpDelay', _VideoPlayer, Config, 200);
boolean('loop', _VideoPlayer, Config, true);
number('miniFeedbackHideDelay', _VideoPlayer, Config, 2000);
boolean('muted', _VideoPlayer, Config, true);
boolean('no5WayJump', _VideoPlayer, Config);
boolean('noAutoPlay', _VideoPlayer, Config);
boolean('noAutoShowMediaControls', _VideoPlayer, Config);
boolean('noMediaSliderFeedback', _VideoPlayer, Config, false);
boolean('noMiniFeedback', _VideoPlayer, Config);
boolean('noSlider', _VideoPlayer, Config);
boolean('pauseAtEnd', _VideoPlayer, Config);
boolean('seekDisabled', _VideoPlayer, Config);
boolean('spotlightDisabled', _VideoPlayer, Config);
boolean('thumbnailUnavailable', _VideoPlayer, Config);
text('title', _VideoPlayer, Config, 'Limestone VideoPlayer Sample Video');
number('titleHideDelay', _VideoPlayer, Config, 4000);
text(
	'actionGuideButtonAriaLabel',
	_VideoPlayer,
	MediaControlsConfig,
	''
);
text(
	'actionGuideLabel',
	_VideoPlayer,
	MediaControlsConfig,
	'Please Scroll or Press Down Button'
);
text('jumpBackwardAriaLabel', _VideoPlayer, MediaControlsConfig, '');
select('jumpBackwardIcon', _VideoPlayer, icons, MediaControlsConfig, 'jumpbackward');
boolean('jumpButtonsDisabled', _VideoPlayer, MediaControlsConfig);
text('jumpForwardAriaLabel', _VideoPlayer, MediaControlsConfig, '');
select('jumpForwardIcon', _VideoPlayer, icons, MediaControlsConfig, 'jumpforward');
boolean('noJumpButtons', _VideoPlayer, MediaControlsConfig);
boolean('rateChangeDisabled', _VideoPlayer, MediaControlsConfig);
boolean('moreActionDisabled', _VideoPlayer, MediaControlsConfig);
select('pauseIcon', _VideoPlayer, icons, MediaControlsConfig, 'pause');
select('playIcon', _VideoPlayer, icons, MediaControlsConfig, 'play');
boolean('playPauseButtonDisabled', _VideoPlayer, MediaControlsConfig);

_VideoPlayer.storyName = 'VideoPlayer';
_VideoPlayer.parameters = {
	info: {
		text: 'The basic VideoPlayer'
	}
};
