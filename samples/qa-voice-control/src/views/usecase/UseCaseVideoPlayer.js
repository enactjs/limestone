import {VideoPlayer} from '@enact/limestone/VideoPlayer';

// Big Buck Bunny (CC BY 3.0) - Blender Foundation, https://www.blender.org
const src = 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4';

const UseCaseVideoPlayer = () => {
	return (
		<VideoPlayer title="hello">
			<source src={src} type="video/mp4" />
		</VideoPlayer>
	);
};

export default UseCaseVideoPlayer;
