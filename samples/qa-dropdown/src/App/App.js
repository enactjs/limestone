import * as React from 'react';

import Item from '@enact/limestone/Item';
import * as Panels from '@enact/limestone/Panels';
import * as PopupTabLayouts from '@enact/limestone/PopupTabLayout';
import * as Flexible from '@enact/limestone/FlexiblePopupPanels';
import ThemeDecorator from '@enact/limestone/ThemeDecorator';

const MainPanel = props => {
	const [open, setOpen] = React.useState(false);

	const handleBack = React.useCallback(() => {
		setOpen(false);
	}, []);

	const handleOpenClick = React.useCallback(() => {
		setOpen(true);
	}, []);

	return (
		<Panels.Panel>
			<PopupTabLayouts.PopupTabLayout
				{...props}
				open={!open}
				scrimType="transparent"
				spotlightRestrict="self-first"
			>
				<PopupTabLayouts.Tab title="Tab 1" key="tab1">
					<PopupTabLayouts.TabPanels onBack={handleBack}>
						<PopupTabLayouts.TabPanel key="tab1">
							<Panels.Header title="PopupTabLayout" type="compact" subtitle="This is subtitle" centered />
							<Item onClick={handleOpenClick}>ABC</Item>
						</PopupTabLayouts.TabPanel>
					</PopupTabLayouts.TabPanels>
				</PopupTabLayouts.Tab>
			</PopupTabLayouts.PopupTabLayout>
			<Flexible.FlexiblePopupPanels
				open={open}
				noAnimation
				onClose={handleBack}
			>
				<Flexible.Panel size="auto">
					<Flexible.Header title="Flexible" centered subtitle="abc" />
				</Flexible.Panel>
			</Flexible.FlexiblePopupPanels>
		</Panels.Panel>
	);
};

export default ThemeDecorator(MainPanel);