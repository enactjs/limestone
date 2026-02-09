import {checkPropTypes, usePrevious} from '@enact/core/util';
import Spotlight from '@enact/spotlight';
import PropTypes from 'prop-types';

import css from './FlexiblePopupPanels.module.less';

const prevButtonSelector = `.${css.navCellBefore} .${css.navButton}`;
const nextButtonSelector = `.${css.navCellAfter} .${css.navButton}`;

function useNavButtonFocus ({index}) {
	const prevIndex = usePrevious(index);

	let autoFocus;

	// on index change
	if (index !== prevIndex) {
		const current = Spotlight.getCurrent();
		// if the currently focused component is a nav button
		if (current && current.classList.contains(css.navButton)) {
			const prevButtonFocused = current.matches(prevButtonSelector);

			// set autoFocus to point to the selector for the appropriate button
			autoFocus = prevButtonFocused ? prevButtonSelector : nextButtonSelector;
		}
	}

	return {
		autoFocus
	};
}

const NavButtonFocusDecorator = Wrapped => {
	// eslint-disable-next-line no-shadow
	function NavButtonFocusDecorator (props) {
		checkPropTypes(NavButtonFocusDecorator, props);

		const {index, ...rest} = props;
		const nav = useNavButtonFocus({index});

		return (
			<Wrapped
				{...rest}
				{...nav}
				index={index}
			/>
		);
	}

	NavButtonFocusDecorator.propTypes = {
		index: PropTypes.number
	};

	return NavButtonFocusDecorator;
};

export default useNavButtonFocus;
export {
	useNavButtonFocus,
	NavButtonFocusDecorator
};
