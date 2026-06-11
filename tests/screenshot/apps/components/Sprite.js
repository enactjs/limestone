import Sprite from '../../../../Sprite';

import {withConfig} from './utils';

import spriteGear2k from '../../images/sprite-gear-2k.png';
import spriteGear4k from '../../images/sprite-gear-4k.png';

const spriteSmokeTests = [
	<Sprite src={{fhd: spriteGear2k, uhd: spriteGear4k}} columns={6} rows={5} height={120} width={120} orientation="horizontal" stopped />,
	<Sprite src={{fhd: spriteGear2k, uhd: spriteGear4k}} columns={6} rows={5} height={120} width={120} orientation="vertical" stopped />
];

const SpriteTests = [
	...spriteSmokeTests,
	...withConfig({locale: 'ar-SA'}, spriteSmokeTests)
];

export default SpriteTests;
