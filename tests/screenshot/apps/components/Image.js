import Image from '../../../../Image';

import hd from '../../images/200x200.png';
import fhd from '../../images/300x300.png';
import uhd from '../../images/600x600.png';

import {withConfig} from './utils';

const imageSmokeTests = [
	<Image placeholder={hd} />,
	<Image placeholder={hd} src={fhd} />,
	<Image placeholder={hd} src="xyz" />

];

const imageQwtcTests = [
	// Change 'sizing' dynamically (LTR / RTL) - [QWTC-2140] - Step 10
	<Image src={hd} sizing="none" />,
	<Image src={fhd} sizing="none" />,
	<Image src={uhd} sizing="none" />,

	// Change 'sizing' dynamically (LTR / RTL) - [QWTC-2140] - Step 9
	<Image src={hd} sizing="fit" />,
	<Image src={fhd} sizing="fit" />,
	<Image src={uhd} sizing="fit" />,

	// Change 'sizing' dynamically (LTR / RTL) - [QWTC-2140] - Step 8
	<Image src={hd} sizing="fill" />,
	<Image src={fhd} sizing="fill" />,
	<Image src={uhd} sizing="fill"  />
];

const imageRtlTests = [
	// *************************************************************
	// locale = 'ar-SA'
	// *************************************************************
	// Change 'sizing' dynamically (LTR / RTL) - [QWTC-2140] - Step 6
	<Image src={hd} sizing="none" />,
	// Change 'sizing' dynamically (LTR / RTL) - [QWTC-2140] - Step 5
	<Image src={hd} sizing="fit" />,
	// Change 'sizing' dynamically (LTR / RTL) - [QWTC-2140] - Step 4
	<Image src={hd} sizing="fill" />
];

const ImageTests = [
	...imageSmokeTests,
	...imageQwtcTests,
	...withConfig({locale: 'ar-SA'}, imageRtlTests)
];

export default ImageTests;
