import {BodyText} from '@enact/limestone/BodyText';
import {Header, Panel} from '@enact/limestone/Panels';
import TabLayout, {Tab} from '@enact/limestone/TabLayout';
import Button from '@enact/limestone/Button';
import {useCallback, useEffect, useRef, useState} from 'react';

const MainPanel = () => {
	const [isLandscape, setIsLandscape] = useState(true);

	const windowSize = useRef({width: window.innerWidth, height: window.innerHeight});

	const handleScreenOrientationChange = useCallback(async ({key}) => {
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

	useEffect(() => {
		window.addEventListener('keypress', handleScreenOrientationChange);

		return () => window.removeEventListener('keypress', handleScreenOrientationChange);
	}, [handleScreenOrientationChange]);

	const headerTitle = 'QA Sampler for TabLayout orientation change';
	const headerSubtitle = 'Press the R button to emulate the change of the screen orientation';
	const screenOrientationSize = `Orientation: ${isLandscape ? 'landscape' : 'portrait'} Width: ${window.innerWidth} Height: ${window.innerHeight}`;

	return (
		<Panel>
			<Header subtitle={headerSubtitle} title={headerTitle} />
			<BodyText>{screenOrientationSize}</BodyText>
			<TabLayout>
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
