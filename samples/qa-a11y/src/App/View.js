import {checkPropTypes, setDefaultProps} from '@enact/core/util';
import {Header, Panel} from '@enact/limestone/Panels';
import Scroller from '@enact/limestone/Scroller';
import Layout, {Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';

const viewDefaultProps = {
	debugProps: false,
	isAriaHidden: false,
	isDebugMode: false,
	isHeader: true,
	noCloseButton: false
};

const View = (props) => {
	const viewProps = setDefaultProps(props, viewDefaultProps);
	checkPropTypes(View, viewProps);

	const {
		debugProps,
		handleDebug,
		isAriaHidden,
		isDebugMode,
		isHeader,
		noCloseButton,
		title,
		view: ComponentView
	} = viewProps;

	const
		header = isHeader ? <Header aria-hidden={isAriaHidden} noCloseButton={noCloseButton} title={title} type="compact" /> : null,
		componentProps = debugProps ? {handleDebug, isDebugMode} : null;

	return (
		<Panel aria-owns="floatLayer" style={{padding: 0}}>
			{header}
			<Layout orientation="vertical">
				<Cell component={Scroller}>
					<ComponentView {...componentProps} />
				</Cell>
			</Layout>
		</Panel>
	);
};

View.propTypes = {
	debugProps: PropTypes.bool,
	handleDebug: PropTypes.func,
	isAriaHidden: PropTypes.bool,
	isDebugMode: PropTypes.bool,
	isHeader: PropTypes.bool,
	noCloseButton: PropTypes.bool,
	title: PropTypes.string,
	view: PropTypes.func
};

export default View;
