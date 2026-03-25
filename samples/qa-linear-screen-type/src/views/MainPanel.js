import BodyText from '@enact/limestone/BodyText';
import ContextualPopupDecorator from '@enact/limestone/ContextualPopupDecorator';
import Item from '@enact/limestone/Item';
import TooltipDecorator from '@enact/limestone/TooltipDecorator';
import VirtualList from '@enact/limestone/VirtualList';
import ri from '@enact/ui/resolution';
import {Button} from '@enact/limestone/Button';
import {CheckboxItem} from '@enact/limestone/CheckboxItem';
import {PageViews} from '@enact/limestone/PageViews';
import {Fragment, useCallback, useState} from 'react';

const TooltipButton = TooltipDecorator({tooltipDestinationProp: 'decoration'}, Button);
const ContextualButton = ContextualPopupDecorator(Button);

const MainPanel = ({onClickCheckbox}) => {
	const [baseScreen, setBaseScreen] = useState(true);
	const [currentScreen, setCurrentScreen] = useState(false);
	const [originalSelected, setOriginalSelected] = useState(false);
	const [currentFontSize, setCurrentFontSize] = useState(document.documentElement.style.fontSize);

	window.onresize = () => {
		setCurrentFontSize(document.documentElement.style.fontSize);
	};

	const setState = useCallback((base, current, original) => {
		setBaseScreen(base);
		setCurrentScreen(current);
		setOriginalSelected(original);
	}, []);

	const handleBaseScreenClick = useCallback((ev) => {
		setState(true, false, false);
		onClickCheckbox(ev);
	}, [onClickCheckbox, setState]);

	const handleCurrentScreenClick = useCallback((ev) => {
		setState(false, true, false);
		onClickCheckbox(ev);
	}, [onClickCheckbox, setState]);

	const handleOriginalOnClick = useCallback(() => {
		setState(false, false, true);
		onClickCheckbox();
	}, [onClickCheckbox, setState]);

	const renderPopupContent = useCallback(() => {
		return <div>Popup Content</div>;
	}, []);

	// eslint-disable-next-line enact/display-name
	const itemRenderer = useCallback(({index, ...rest}) => {
		return <Item {...rest}>Item {index}</Item>;
	}, []);

	return (
		<Fragment>
			<BodyText>Current Font Size: {currentFontSize}</BodyText>
			<BodyText>Select Scaling Type and Resize the Window</BodyText>
			<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
				<div>
					<BodyText>Linear Scaling: </BodyText>
					<CheckboxItem selected={baseScreen} id="baseScreen" onClick={handleBaseScreenClick}>Base Screen Ratio (Continuous Scaling)</CheckboxItem>
					<CheckboxItem selected={currentScreen} id="currentScreen" onClick={handleCurrentScreenClick}>Current Screen Ratio</CheckboxItem>
				</div>
				<div>
					<BodyText>Original Scaling: </BodyText>
					<CheckboxItem selected={originalSelected} onClick={handleOriginalOnClick}>Original Scaling</CheckboxItem>
				</div>
			</div>
			<hr />
			<div style={{height: '35%'}}>
				<PageViews>
					<PageViews.Page>
						<Button>Limestone Button</Button>
						<ContextualButton open popupComponent={renderPopupContent}>
							Limestone Popup
						</ContextualButton>
						<TooltipButton tooltipText="tooltip">
							Limestone Tooltip
						</TooltipButton>
					</PageViews.Page>
					<PageViews.Page>
						<VirtualList dataSize={100} itemRenderer={itemRenderer} itemSize={ri.scale(156)} />
					</PageViews.Page>
				</PageViews>
			</div>
		</Fragment>
	);
};

export default MainPanel;
