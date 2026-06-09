import Popup from '../../../../Popup';
import {withConfig, withProps} from './utils';

const popupPositionTests = [
	// [QWTC-1904]
	<Popup open position="fullscreen">Fullscreen Popup!</Popup>,
	<Popup open position="center">Center Popup!</Popup>,
	<Popup open position="left">Left Popup!</Popup>,
	<Popup open position="right">Right Popup!</Popup>,
	<Popup open position="top">Top Popup!</Popup>,
	<Popup open position="bottom left">Bottom Left Popup!</Popup>,
	<Popup open position="bottom right">Bottom Right Popup!</Popup>,
	<Popup open position="top left">Top Left Popup!</Popup>,
	<Popup open position="top right">Top Right Popup!</Popup>
	// End of [QWTC-1904]
];

const popupBaseTests = [
	<Popup open>Popup!</Popup>,
	...popupPositionTests
];

const popupSmokeTests = [
	...withProps({scrimType: 'translucent'}, [<Popup open>Popup!</Popup>])
];

const popupQwtcTests = [
	...withProps({scrimType: 'translucent'}, popupPositionTests)
];

const popupCommentedTests = [
	...withProps({scrimType: 'transparent'}, popupBaseTests),
	...withProps({scrimType: 'none'}, popupBaseTests)
];

const popupRtlTests = [
	// *************************************************************
	// locale = 'ar-SA'
	// *************************************************************
	// [QWTC-1897]
	...withProps({scrimType: 'translucent'}, popupBaseTests),
	...withProps({scrimType: 'transparent'}, popupBaseTests),
	...withProps({scrimType: 'none'}, popupBaseTests)
];

const PopupTests = [
	...popupSmokeTests,
	...popupQwtcTests,
	...popupCommentedTests,
	...withConfig({locale: 'ar-SA'}, popupRtlTests)
];

export default withConfig({wrapper: {full: true}}, PopupTests);
