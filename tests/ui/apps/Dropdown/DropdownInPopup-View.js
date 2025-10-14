import Dropdown from '../../../../Dropdown';
import FixedPopupPanels, {Header, Panel} from "../../../../FixedPopupPanels";
import * as Panels from "../../../../Panels";
import ThemeDecorator from '../../../../ThemeDecorator';
import spotlight from '@enact/spotlight';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => (
	<Panels.Panel {...props}>
		<Panels.Header title="External Header" />
		<FixedPopupPanels open fullHeight>
			<Panel aria-label="Testing Dropdown inside FixedPopupPanel">
				<Header title="FixedPopupPanel Header" />
				<Dropdown id="dropdownDefault">
					{['one', 'two', 'three', 'four', 'five']}
				</Dropdown>
			</Panel>
		</FixedPopupPanels>
	</Panels.Panel>
);

export default ThemeDecorator(app);
