import Radio from '../../../../Radio';
import ThemeDecorator from '../../../../ThemeDecorator';
import spotlight from '@enact/spotlight';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => <div {...props}>
	<div style={{padding: '20px'}}>
		<Radio
			id="normalRadio"
		/>
	</div>
	<div style={{padding: '20px'}}>
		<Radio
			id="labeledRadio"
		>
			Radio Label
		</Radio>
	</div>
	<div style={{padding: '20px'}}>
		<Radio
			id="selectedRadio"
			defaultSelected
		/>
	</div>
	<div style={{padding: '20px'}}>
		<Radio
			id="disabledRadio"
			disabled
		/>
	</div>
</div>;

export default ThemeDecorator(app);
