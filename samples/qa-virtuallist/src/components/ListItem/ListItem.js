import Item from '@enact/limestone/Item';
import PropTypes from 'prop-types';
import {use} from 'react';

import {ListContext} from '../../context/ListContext';

const ListItem = (props) => {
	const {children, index, ...rest} = props;
	const {disabled} = use(ListContext).listItems[index];

	return (
		<Item {...rest} disabled={disabled}>
			{children}
		</Item>
	);
};

ListItem.propTypes = {
	children: PropTypes.any,
	index: PropTypes.number
};

export default ListItem;
