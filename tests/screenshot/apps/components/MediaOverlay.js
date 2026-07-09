import MediaOverlay from '../../../../MediaOverlay';

import img from '../../images/600x600.png';

import {withConfig} from './utils';

const videoSrc = "../../videos/movie_90.mp4";

const mediaOverlaySmokeTests = [
	// Base Tests
	<MediaOverlay />,
	<MediaOverlay caption="DTV 7-1" title="Program Name" subtitle="07:00 AM - 08:00 AM" disabled><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay imageOverlay={img} caption="DTV 7-1" title="Program Name" subtitle="07:00 AM - 08:00 AM" />,
	<MediaOverlay imageOverlay={img} caption="DTV 7-1" title="Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,

	// Caption / Title / Subtitle combinations
	<MediaOverlay caption="DTV 7-1"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="DTV 7-1" title="Program Name"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="DTV 7-1" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="DTV 7-1" title="Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay title="Program Name"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay title="Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,

	<MediaOverlay text="The quick brown fox jumped over the lazy dog. The bean bird flies at sundown." textAlign="start"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay text="The quick brown fox jumped over the lazy dog. The bean bird flies at sundown." textAlign="center"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay text="The quick brown fox jumped over the lazy dog. The bean bird flies at sundown." textAlign="end"><source src={videoSrc} /></MediaOverlay>,

	<MediaOverlay caption="DTV 7-1" progress={0.5} showProgress><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="DTV 7-1" progress={0.5} showProgress title="Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>
];

const mediaOverlayFocusTests = [
	<MediaOverlay caption="Focused DTV 7-1" title="Focused Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay imageOverlay={img} caption="Focused DTV 7-1" title="Focused Program Name" subtitle="07:00 AM - 08:00 AM" />,
	<MediaOverlay imageOverlay={img} caption="Focused DTV 7-1" title="Focused Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="Focused DTV 7-1" title="Focused Program Name" subtitle="07:00 AM - 08:00 AM" disabled><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay imageOverlay={img} caption="Focused DTV 7-1" title="Focused Program Name" subtitle="07:00 AM - 08:00 AM" disabled />,

	// Caption / Title / Subtitle combinations
	<MediaOverlay caption="Focused DTV 7-1"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="Focused DTV 7-1" title="Focused Program Name"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="Focused DTV 7-1" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="Focused DTV 7-1" title="Focused Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay title="Focused Program Name"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay title="Focused Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay subtitle="Focused 07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,

	<MediaOverlay text="Focused The quick brown fox jumped over the lazy dog. The bean bird flies at sundown." textAlign="start"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay text="Focused The quick brown fox jumped over the lazy dog. The bean bird flies at sundown." textAlign="center"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay text="Focused The quick brown fox jumped over the lazy dog. The bean bird flies at sundown." textAlign="end"><source src={videoSrc} /></MediaOverlay>,

	<MediaOverlay caption="Focused DTV 7-1" progress={0.5} showProgress><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="Focused DTV 7-1" progress={0.5} showProgress title="Focused Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>
];

const mediaOverlayLargeTextTests = [
	// Large text
	<MediaOverlay caption="Focused DTV 7-1" title="Focused Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay imageOverlay={img} caption="Focused DTV 7-1" title="Focused Program Name" subtitle="07:00 AM - 08:00 AM" />,
	<MediaOverlay text="Focused The quick brown fox jumped over the lazy dog. The bean bird flies at sundown." textAlign="start"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay caption="Focused DTV 7-1" progress={0.5} showProgress title="Focused Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>
];

const mediaOverlayRtlTests = [
	// *************************************************************
	// locale = 'ar-SA'
	// *************************************************************
	// — smoke representatives
	<MediaOverlay />,
	<MediaOverlay caption="DTV 7-1" title="Program Name" subtitle="07:00 AM - 08:00 AM"><source src={videoSrc} /></MediaOverlay>,
	// Caption / Title / Subtitle combinations
	<MediaOverlay caption="DTV 7-1"><source src={videoSrc} /></MediaOverlay>,
	<MediaOverlay text="The quick brown fox jumped over the lazy dog. The bean bird flies at sundown." textAlign="start"><source src={videoSrc} /></MediaOverlay>
];

const MediaOverlayTests = [
	...mediaOverlaySmokeTests,
	...withConfig({focus: true}, mediaOverlayFocusTests),
	...withConfig({textSize: 'large'}, mediaOverlayLargeTextTests),
	...withConfig({locale: 'ar-SA'}, mediaOverlayRtlTests)
];

export default MediaOverlayTests;
