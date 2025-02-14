import DayPicker, {getSelectedDayString} from '@enact/limestone/DayPicker';
import Heading from '@enact/limestone/Heading';
import Item from '@enact/limestone/Item';
import Scroller from '@enact/limestone/Scroller';
import {Component} from 'react';

DayPicker.displayName = 'DayPicker';

class DayPickerWithItem extends Component {
	constructor (props) {
		super(props);
		this.state = {
			selectedDayString: 'None selected'
		};
	}

	handleSelect = (ev) => {
		this.setState({selectedDayString: getSelectedDayString(ev.selected, 'None selected')});
	};

	render () {
		const {selectedDayString} = this.state;

		return (
			<Scroller>
				<Heading size="small">
					Select several days, every day, every weekday and weekend.
					<br />
					Change locale to *es-ES* starting on Monday.
				</Heading>
				<Item label={selectedDayString}>{'Selected Day'}</Item>
				<DayPicker onSelect={this.handleSelect} />
			</Scroller>
		);
	}
}

export default {
	title: 'Limestone/DayPicker',
	component: 'DayPicker'
};

export const ToTestGetSelectedDayString = () => <DayPickerWithItem />;

ToTestGetSelectedDayString.storyName = 'to test getSelectedDayString()';
ToTestGetSelectedDayString.parameters = {
	controls: {
		hideNoControlsWarning: true
	}
};
