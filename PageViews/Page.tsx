import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import type {ReactNode} from 'react';

import css from './Page.module.less';

export interface PageProps {
	'aria-label'?: string;
	children?: ReactNode;
	css?: Record<string, string>;
}

/**
 * Page for {@link limestone/PageViews.PageViews|PageViews}.
 *
 * @class Page
 * @memberof limestone/PageViews
 * @ui
 * @public
 */
const Page = kind({
	name: 'Page',

	_propTypes: {} as PageProps,

	propTypes: /** @lends limestone/PageViews.Page.prototype */ {
		/**
		 * Contents of the page.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `page` - The root component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>
	},

	styles: {
		css,
		className: 'page',
		publicClassNames: true
	},

	render: ({children, ...rest}) => {
		return (
			<div {...rest}>
				{children}
			</div>
		);
	}
});

/**
 * The aria-label for the page.
 *
 * Example:
 * ```
 * <PageViews.Page aria-label="This is a description for page">
 * ```
 * @name aria-label
 * @type {String}
 * @memberof limestone/PageViews.Page.prototype
 * @public
 */

export default Page;
export {
	Page
};
