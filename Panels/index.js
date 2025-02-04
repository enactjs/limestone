/**
 * Panels provides a way to manage different screens of an app.
 *
 * @module limestone/Panels
 * @exports Header
 * @exports Panel
 * @exports Panels
 * @exports PanelsBase
 * @exports Routable
 * @exports Route
 */

import Routable, {Route} from '@enact/ui/Routable';

import Header, {HeaderBase} from './Header';
import Panel from './Panel';
import Panels from './Panels';

export default Panels;
export {
	Header,
	HeaderBase,
	Panel,
	Panels,
	Panels as PanelsBase,

	/**
	 * A higher-order component that provides support for mapping Routes as children of a component
	 * which are selected via `path` instead of the usual flat array.
	 *
	 * @see {@link ui/Routable.Routable}
	 * @hoc
	 * @name Routable
	 * @extends ui/Routable.Routable
	 * @memberof limestone/Panels
	 * @public
	 */
	Routable,

	/**
	 * Used with {@link limestone/Panels.Routable} to define the `path` segment and the
	 * `component` to render.
	 *
	 * @see {@link ui/Routable.Route}
	 * @ui
	 * @name Route
	 * @extends ui/Routable.Route
	 * @memberof limestone/Panels
	 * @public
	 */
	Route
};
