
import Button from '@enact/limestone/Button';
import Heading from '@enact/limestone/Heading';
import Item from '@enact/limestone/Item';
import {Header} from '@enact/limestone/Panels';
import PopupTabLayout, {Tab, TabPanel, TabPanels} from '@enact/limestone/PopupTabLayout';
import {useCallback, useState} from 'react';

// A 4-tab PopupTabLayout that opens on launch. With `prerender`, FloatingLayer renders the
// content inline during the prerender pass (and the initial client render), then relocates it
// into the floating layer via a portal once mounted — so the tabs appear in the prerendered HTML
// and hydrate without a mismatch. Toggle `optimized`/`prerender` below to compare.
const MainPanel = () => {
	// Opened on launch so the popup is part of the initial (prerendered) render.
	const [open, setOpen] = useState(true);

	const handleClose = useCallback(() => setOpen(false), []);
	const handleOpen = useCallback(() => setOpen(true), []);

	return (
		<div>
			<Heading showLine>PopupTabLayout prerender sample</Heading>
			<Button onClick={handleOpen}>Open PopupTabLayout</Button>

			<PopupTabLayout open={open} prerender onClose={handleClose}>
				<Tab icon="picture" title="Picture">
					<TabPanels>
						<TabPanel>
							<Header title="Picture" type="compact" />
							<Item>Brightness</Item>
							<Item>Contrast</Item>
							<Item>Color</Item>
						</TabPanel>
					</TabPanels>
				</Tab>
				<Tab icon="sound" title="Sound">
					<TabPanels>
						<TabPanel>
							<Header title="Sound" type="compact" />
							<Item>Balance</Item>
							<Item>Mode</Item>
						</TabPanel>
					</TabPanels>
				</Tab>
				<Tab icon="bluetoothoff" title="Channels">
					<TabPanels>
						<TabPanel>
							<Header title="Channels" type="compact" />
							<Item>Auto Tuning</Item>
							<Item>Channel Manager</Item>
						</TabPanel>
					</TabPanels>
				</Tab>
				<Tab icon="gear" title="Connection">
					<TabPanels>
						<TabPanel>
							<Header title="Connection" type="compact" />
							<Item>Network</Item>
							<Item>Device Connector</Item>
						</TabPanel>
					</TabPanels>
				</Tab>
			</PopupTabLayout>
		</div>
	);
};

export default MainPanel;
