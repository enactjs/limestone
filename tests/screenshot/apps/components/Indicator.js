import Indicator from '../../../../Indicator';

const IndicatorTests = [
	// Dots
	<Indicator />,
	<Indicator total={5} />,
	<Indicator total={10} />,
	<Indicator total={25} />,
	<Indicator current={3} total={5} />,
	<Indicator current={5} total={10} />,
	<Indicator current={13} total={25} />,
	// Numbers
	<Indicator type="numbers" />,
	<Indicator total={5} type="numbers" />,
	<Indicator total={10} type="numbers" />,
	<Indicator total={25} type="numbers" />,
	<Indicator current={3} total={5} type="numbers" />,
	<Indicator current={5} total={10} type="numbers" />,
	<Indicator current={13} total={25} type="numbers" />,
	// Numbers with no buttons
	<Indicator hideButtons type="numbers" />,
	<Indicator hideButtons total={5} type="numbers" />,
	<Indicator hideButtons total={10} type="numbers" />,
	<Indicator hideButtons total={25} type="numbers" />,
	<Indicator current={3} hideButtons total={5} type="numbers" />,
	<Indicator current={5} hideButtons total={10} type="numbers" />,
	<Indicator current={13} hideButtons total={25} type="numbers" />
];

export default IndicatorTests;
