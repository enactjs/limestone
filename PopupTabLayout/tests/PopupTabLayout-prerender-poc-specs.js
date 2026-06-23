/*
 * Prerendering PopupTabLayout
 *
 * Demonstrates that a 4-tab PopupTabLayout CANNOT be prerendered through the default
 * (React portal-based) Popup path, but CAN be prerendered using the `prerender` private prop,
 * which swaps the FloatingLayer/createPortal for a plain div.
 *
 * "Prerendering" here means a single `react-dom/server` renderToString() pass (mount phase only, no lifecycle,
 * no setState-driven second render). See dev-utils/plugins/PrerenderPlugin/vdom-server-render.js
 */

/* eslint-disable testing-library/render-result-naming-convention */
// `renderToString` returns an HTML string, not a testing-library render result.

import {FloatingLayerDecorator} from '@enact/ui/FloatingLayer';
import {renderToString} from 'react-dom/server';

import {Item} from '../../Item';
import {PopupTabLayout, Tab, TabPanel, TabPanels} from '../PopupTabLayout';

const FloatingLayerController = FloatingLayerDecorator('div');

const FourTabLayout = (props) => (
	<PopupTabLayout open {...props}>
		<Tab title="Picture">
			<TabPanels>
				<TabPanel>
					<Item>Brightness</Item>
					<Item>Contrast</Item>
				</TabPanel>
			</TabPanels>
		</Tab>
		<Tab title="Sound">
			<TabPanels>
				<TabPanel>
					<Item>Balance</Item>
				</TabPanel>
			</TabPanels>
		</Tab>
		<Tab title="Channels">
			<TabPanels>
				<TabPanel>
					<Item>Auto Tuning</Item>
				</TabPanel>
			</TabPanels>
		</Tab>
		<Tab title="Connection">
			<TabPanels>
				<TabPanel>
					<Item>Network</Item>
				</TabPanel>
			</TabPanels>
		</Tab>
	</PopupTabLayout>
);

const prerender = (element) => renderToString(
	<FloatingLayerController>{element}</FloatingLayerController>
);

describe('PopupTabLayout prerendering PoC', () => {
	const tabTitles = ['Picture', 'Sound', 'Channels', 'Connection'];

	test('default (portal) path: a single renderToString pass produces NO popup content', () => {
		// The default path renders through Popup -> FloatingLayer, whose first render returns
		// null until `readyToRender` flips post-mount. A prerender pass never gets that second
		// render, so the tab content is absent from the HTML
		const html = prerender(<FourTabLayout />);

		tabTitles.forEach((title) => {
			expect(html).not.toContain(title);
		});
	});

	test('optimized path: a single renderToString pass produces the full 4-tab content', () => {
		const html = prerender(<FourTabLayout optimized />);

		// All four tab titles are present in the prerendered HTML
		tabTitles.forEach((title) => {
			expect(html).toContain(title);
		});

		// the content of the first (active) tab's panel is also present.
		expect(html).toContain('Brightness');
		expect(html).toContain('Contrast');
	});

	test('prerender path (real Popup/FloatingLayer): a single renderToString pass produces the full 4-tab content', () => {
		// Unlike `optimized`, this keeps the real Popup + FloatingLayer; the `prerender` prop makes
		// FloatingLayer render its content inline during the prerender pass instead of returning null.
		const html = prerender(<FourTabLayout prerender />);

		tabTitles.forEach((title) => {
			expect(html).toContain(title);
		});

		expect(html).toContain('Brightness');
		expect(html).toContain('Contrast');
	});
});
