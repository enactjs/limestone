/**
 * Provides a Limestone styled pages component with page indicator and navigation buttons.
 *
 * Usage:
 * ```
 * <PageViews>
 *		<PageViews.Page aria-label="This is a description for page">
 *			lorem ipsum ...
 *		</PageViews.Page>
 * </PageViews>
 * ```
 * @module limestone/PageViews
 * @exports PageViews
 */

import {PageViews} from './PageViews';
import Page from './Page';

/**
 * A shortcut to access {@link limestone/PageViews.Page}
 *
 * @name Page
 * @static
 * @memberof limestone/PageViews.PageViews
 */
PageViews.Page = Page;

export default PageViews;
export {
	Page,
	PageViews
};
