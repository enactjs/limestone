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
 * @module limestone/Chips
 * @exports Chips
 */

 import Chips from './Chips';
 import Chip from './Chip';
 
 /**
  * A shortcut to access {@link limestone/PageViews.Page}
  *
  * @name Page
  * @static
  * @memberof limestone/PageViews.PageViews
  */
 Chips.Chip = Chip;
 
 export default Chips;
 export {
    Chip,
    Chips
 };
 