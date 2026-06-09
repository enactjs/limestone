import {MediaControls} from '../../../../MediaPlayer';
import VideoPlayer from '../../../../VideoPlayer';
import posterUrl from '../../images/poster.png';
import videoUrl from '../../videos/movie_90.mp4';

const videoTitle = 'Limestone VideoPlayer Sample Video';
const fullWrapper = {full: true};

const commonVideoPlayer = (props) => (
	<div
		style={{
			transformOrigin: 'top',
			height: '70vh'
		}}
	>
		<VideoPlayer
			disabled={props.disabled}
			noAutoPlay={props.noAutoPlay}
			noSlider={props.noSlider}
			poster={props.poster}
			title={props.title}
		>
			<source src={props.src} type="video/mp4" />
			<infoComponents>
				A video about some things happening to and around some characters. Very exciting stuff.
			</infoComponents>
			<MediaControls>
				{!props.noButtonComponent &&
				<bottomComponents />
				}
			</MediaControls>
		</VideoPlayer>
	</div>
);

const videoPlayerSmokeTests = [
	{
		component: commonVideoPlayer({src: ''}),
		wrapper: fullWrapper
	},
	{
		component: commonVideoPlayer({src: 'differentSrc'}),
		wrapper: fullWrapper,
		focus: true
	},
	{
		component: commonVideoPlayer({src: '', disabled: true}),
		wrapper: fullWrapper
	},
	{
		component: commonVideoPlayer({src: '', poster: posterUrl}),
		wrapper: fullWrapper
	},
	{
		component: commonVideoPlayer({src: '', poster: posterUrl, title: videoTitle}),
		wrapper: fullWrapper
	},
	{
		component: commonVideoPlayer({src: videoUrl, noAutoPlay: true}),
		wrapper: fullWrapper
	},
	{
		component: commonVideoPlayer({src: videoUrl, noSlider: true}),
		wrapper: fullWrapper
	},
	{
		component: commonVideoPlayer({src: videoUrl, includeTimeHour: true}),
		wrapper: fullWrapper
	},
	{
		component: commonVideoPlayer({src: '', poster: posterUrl, title: videoTitle, noSlider: true}),
		wrapper: fullWrapper
	},
	{
		component: commonVideoPlayer({src: '', noButtonComponent: true}),
		wrapper: fullWrapper
	}
];

const videoPlayerLargeTextTests = [
	// textSize = 'large'
	{
		component: commonVideoPlayer({src: '', poster: posterUrl, title: videoTitle}),
		wrapper: fullWrapper,
		textSize: 'large'
	},
	{
		component: commonVideoPlayer({src: videoUrl, noAutoPlay: true}),
		wrapper: fullWrapper,
		textSize: 'large'
	}
];

const VideoPlayerTests = [
	...videoPlayerSmokeTests,
	...videoPlayerLargeTextTests
];

export default VideoPlayerTests;
