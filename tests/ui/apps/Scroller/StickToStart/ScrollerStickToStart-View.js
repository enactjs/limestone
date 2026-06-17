import {Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {Component} from 'react';

import Button from '../../../../../Button';
import Card from '../../../../../Card';
import Header from '../../../../../Panels/Header';
import Scroller from '../../../../../Scroller';
import ThemeDecorator from '../../../../../ThemeDecorator';

const OptionsContainer = SpotlightContainerDecorator({leaveFor: {down: '#item0'}}, 'div');

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const cardColors = ['9037ab', '3478ab', 'ab3737', '37ab51', 'ab8137', '5e37ab'];

// Inline SVG data URI so the cards do not depend on the network during UI tests.
const svgGenerator = (width, height, bgColor, customText) => (
	`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' width='${width}' height='${height}'%3E` +
	`%3Crect width='${width}' height='${height}' fill='%23${bgColor}'%3E%3C/rect%3E` +
	`%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='36px' fill='%23ffffff'%3E${customText}%3C/text%3E%3C/svg%3E`
);

class app extends Component {
	constructor (props) {
		super(props);
		this.state = {
			nativeScroll: true
		};
	}

	onToggle = ({currentTarget}) => {
		const key = currentTarget.getAttribute('id');
		this.setState((state) => ({[key]: !state[key]}));
	};

	render () {
		const {nativeScroll} = this.state;
		const scrollMode = nativeScroll ? 'NativeScroll' : 'TranslateScroll';
		return (
			<div {...this.props} id="scroller">
				<Cell component={OptionsContainer} shrink>
					<Button id="nativeScroll" minWidth="false" onClick={this.onToggle} size="small">{scrollMode}</Button>
				</Cell>
				<Header title="Shelf" />
				<Scroller
					direction="horizontal"
					horizontalScrollbar="auto"
					key={nativeScroll ? 'native' : 'translate'}
					scrollMode={nativeScroll ? 'native' : 'translate'}
					stickTo="start"
					verticalScrollbar="hidden"
				>
					<div style={{display: 'flex', minWidth: 'fit-content', padding: '1px'}}>
						{[...Array(20)].map((x, i) => (
							<Card
								id={`item${i}`}
								key={i + 1}
								label={`Description Description Description ${i + 1}`}
								src={svgGenerator(600, 340, cardColors[i % cardColors.length], `Image ${i + 1}`)}
								style={{marginInlineEnd: ri.scaleToRem(48)}}
							>
								{`Content Title Content Title ${i + 1}`}
							</Card>
						))}
					</div>
				</Scroller>
			</div>
		);
	}
}

export default ThemeDecorator(app);
