import {configureActions} from '@enact/storybook-utils/addons/actions';
import {getBooleanType, getObjectType} from '@enact/storybook-utils/addons/controls';
import {createPseudoStateFocusBridge} from '@enact/storybook-utils/decorators';

import ThemeEnvironment from '../src/ThemeEnvironment';

const tvViewports = {
	tvHD: {name: 'TV 720p (HD)', type: 'desktop', styles: {width: '1280px', height: '720px'}},
	tvFHD: {name: 'TV 1080p (FHD)', type: 'desktop', styles: {width: '1920px', height: '1080px'}},
	tvUHD: {name: 'TV 2160p (UHD / 4K)', type: 'desktop', styles: {width: '3840px', height: '2160px'}},
	portraitFHD: {name: 'Portrait 1080p (FHD)', type: 'mobile', styles: {width: '1080px', height: '1920px'}},
	portraitUHD: {name: 'Portrait 2160p (UHD / 4K)', type: 'mobile', styles: {width: '2160px', height: '3840px'}}
};

// NOTE: Locales taken from strawman. Might need to add more in the future.
const locales = {
	'local': '',
	'en-US - US English': 'en-US',
	'ko-KR - Korean': 'ko-KR',
	'es-ES - Spanish, with alternate weekends': 'es-ES',
	'am-ET - Amharic, 5 meridiems': 'am-ET',
	'he-IL - Hebrew, RTL, no meridiem': 'he-IL',
	'th-TH - Thai, with tallglyph characters': 'th-TH',
	'ar-SA - Arabic, RTL and standard font': 'ar-SA',
	'ur-PK - Urdu, RTL and custom Urdu font': 'ur-PK',
	'zh-Hans-HK - Simplified Chinese, custom Hans font': 'zh-Hans-HK',
	'zh-Hant-HK - Traditional Chinese, custom Hant font': 'zh-Hant-HK',
	'vi-VN - Vietnamese, with tallglyph characters': 'vi-VN',
	'ta-IN - Tamil, custom Indian font': 'ta-IN',
	'bn-IN - Bengali': 'bn-IN',
	'hi-IN - Hindi': 'hi-IN',
	'te-IN - Telugu': 'te-IN',
	'ja-JP - Japanese, custom Japanese font': 'ja-JP',
	'en-JP - English, custom Japanese font': 'en-JP',
	'si-LK - Sinhala, external font family with tallglyph characters': 'si-LK',
	'km-KH - Cambodian Khmer, with tallglyph characters': 'km-KH'
};

const backgrounds = {
	'Default (Based on Skin)': 'default',
	'Strawberries (Red)':      '#bb3352 url("https://picsum.photos/1280/720?image=1080") no-repeat center/cover',
	'Tunnel (Green)':          '#4e6a40 url("https://picsum.photos/1280/720?image=1063") no-repeat center/cover',
	'Mountains (Blue)':        '#5985a8 url("https://picsum.photos/1280/720?image=930") no-repeat center/cover',
	'Misty River':             '#71736d url("https://picsum.photos/1280/720?image=1044") no-repeat center/cover',
	'Turbulant Tides':         '#547460 url("https://picsum.photos/1280/720?image=1053") no-repeat center/cover',
	'Space Station':           '#7c4590 url("https://picsum.photos/1280/720?image=967") no-repeat center/cover',
	'Warm Pup':                '#5d6542 url("https://picsum.photos/1280/720?image=1025") no-repeat center/cover',
	'Random':                  '#555 url("https://picsum.photos/1280/720") no-repeat center/cover'
};

const skins = {
	'Neutral': 'neutral',
	'Light': 'light',
	'Game': 'game'
};

configureActions();

export const parameters = {
	options: {
		storySort: {
			method: 'alphabetical'
		}
	},
	pseudo: {
		rootSelector: 'body'
	},
	viewport: {
		options: {
			...tvViewports
		}
	}
};

export const globalTypes = {
	'locale': getObjectType('locale', 'en-US', locales),
	'large text': getBooleanType('large text'),
	'high contrast': getBooleanType('high contrast'),
	'focus ring':getBooleanType('focus ring'),
	'skin': getObjectType('skin', 'neutral', skins),
	'background': getObjectType('background', 'default', backgrounds),
	'debug aria': getBooleanType('debug aria'),
	'debug layout': getBooleanType('debug layout'),
	'debug spotlight': getBooleanType('debug spotlight'),
	'debug sprites': getBooleanType('debug sprites')
};

// storybook-addon-pseudo-states focus bridge (shared factory in @enact/storybook-utils/decorators).
// Limestone's only sampler chrome is the Panel Header, which the factory's default `ignoreSelector` skips.
const PseudoStateFocusBridge = createPseudoStateFocusBridge();

export const decorators = [ThemeEnvironment, PseudoStateFocusBridge];
