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
		<Panels.Header title="ABC" />
		<FixedPopupPanels open fullHeight>
			<Panel aria-label="this is panel 0">
				<Header title="title" />
				<Dropdown>
					{['aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'ccccccccccccccccccccccccccc', 'ddd', 'eee', '111', '222', '333', '444', '555', '666', '777']}
				</Dropdown>
			</Panel>
		</FixedPopupPanels>
	</Panels.Panel>
);

export default ThemeDecorator(app);
