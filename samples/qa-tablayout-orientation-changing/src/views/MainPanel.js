import {BodyText} from '@enact/limestone/BodyText';
import {Header, Panel} from '@enact/limestone/Panels';
import TabLayout, {Tab} from '@enact/limestone/TabLayout';
import Button from '@enact/limestone/Button';
import {useCallback, useEffect, useRef, useState} from 'react';

const MainPanel = () => {
	const [blockCollapseOnPortrait, setBlockCollapseOnPortrait] = useState(false);
	const [blockExpandOnLandscape, setBlockExpandOnLandscape] = useState(false);
	const [isLandscape, setIsLandscape] = useState(true);

	const windowSize = useRef({width: window.innerWidth, height: window.innerHeight});

	const handleScreenOrientationChange = useCallback(({key}) => {
		const {width, height} = windowSize.current;

		if (key.toLowerCase() === 'r') {
			if (!isLandscape) {
				Object.defineProperty(window, 'innerWidth', {configurable: true, value: width});
				Object.defineProperty(window, 'innerHeight', {configurable: true, value: height});
			} else {
				Object.defineProperty(window, 'innerWidth', {configurable: true, value: height});
				Object.defineProperty(window, 'innerHeight', {configurable: true, value: width});
			}

			setIsLandscape(prevState => !prevState);

			window.dispatchEvent(new Event('resize'));
		}
	}, [isLandscape]);

	const handleBlockCollapseOnPortrait = useCallback(() => {
		setBlockCollapseOnPortrait(prevState => !prevState);
	}, []);

	const handleBlockExpandOnLandscape = useCallback(() => {
		setBlockExpandOnLandscape(prevState => !prevState);
	}, []);

	useEffect(() => {
		window.addEventListener('keypress', handleScreenOrientationChange);

		return () => window.removeEventListener('keypress', handleScreenOrientationChange);
	}, [handleScreenOrientationChange]);

	const headerTitle = 'QA Sampler for TabLayout orientation change';
	const headerSubtitle = 'Press the R button to emulate the change of the screen orientation';
	const screenOrientationSize = `Orientation: ${isLandscape ? 'landscape' : 'portrait'} Width: ${window.innerWidth} Height: ${window.innerHeight}`;
	const blockCollapse = `Block Collapse on Portrait: ${blockCollapseOnPortrait} Block Expand on Landscape: ${blockExpandOnLandscape}`;

	return (
		<Panel>
			<Header subtitle={headerSubtitle} title={headerTitle} />
			<BodyText>{screenOrientationSize}</BodyText>
			<Button size="small" onClick={handleBlockCollapseOnPortrait}>Collapse on Portrait</Button>
			<Button size="small" onClick={handleBlockExpandOnLandscape}>Expand on Landscape</Button>
			<BodyText>{blockCollapse}</BodyText>
			<TabLayout
				blockCollapseOnPortrait={blockCollapseOnPortrait}
				blockExpandOnLandscape={blockExpandOnLandscape}
			>
				<Tab title="Settings" icon="gear">
					<Button>Edit</Button>
				</Tab>
				<Tab title="Sound" icon="sound">
					<Button>Edit</Button>
				</Tab>
			</TabLayout>
		</Panel>
	);
};

export default MainPanel;
