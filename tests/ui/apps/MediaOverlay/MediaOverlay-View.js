import MediaOverlay from '../../../../MediaOverlay';
import ThemeDecorator from '../../../../ThemeDecorator';
import spotlight from '@enact/spotlight';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const videos = {
	// Big Buck Bunny (CC BY 3.0) - Blender Foundation, https://www.blender.org
	BigBuckBunny: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'
};

const app = (props) => <div {...props}>
	<MediaOverlay
		id="mediaOverlay1"
		caption="Media Overlay caption"
		muted
		placeholder="Media Overlay placeholder"
		progress={0.5}
		showProgress
		subtitle="Media Overlay subtitle"
		text="Media Overlay text"
		title="Media Overlay title"
	>
		<source src={videos.BigBuckBunny} />
	</MediaOverlay>
	<MediaOverlay
		id="mediaOverlay2LongText"
		caption="Media Overlay very long caption"
		marqueeOn="render"
		muted
		placeholder="Media Overlay very long placeholder"
		progress={0.5}
		showProgress
		subtitle="Media Overlay very long subtitle"
		text="Media Overlay extremely long text"
		title="Media Overlay very long title"
	>
		<source src={videos.BigBuckBunny} />
	</MediaOverlay>
</div>;

export default ThemeDecorator(app);
