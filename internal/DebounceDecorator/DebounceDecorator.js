/**
 * Exports the {@link limestone/internal/DebounceDecorator.DebounceDecorator} higher-order component
 *
 * @module limestone/internal/DebounceDecorator
 * @private
 */

import hoc from '@enact/core/hoc';
import {checkPropTypes, Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useMemo, useRef} from 'react';

/**
 * Default config for {@link limestone/internal/DebounceDecorator.DebounceDecorator}.
 *
 * @memberof limestone/internal/DebounceDecorator.DebounceDecorator
 * @hocconfig
 */
const defaultConfig = {

	/**
	 * Event name to cancel an active debounce
	 *
	 * @type {String}
	 * @default null
	 * @memberof limestone/internal/DebounceDecorator.DebounceDecorator.defaultConfig
	 */
	cancel: null,

	/**
	 * Event name to debounce
	 *
	 * @type {String}
	 * @default 'onChange'
	 * @memberof limestone/internal/DebounceDecorator.DebounceDecorator.defaultConfig
	 */
	debounce: 'onChange',

	/**
	 * Time, in milliseconds, to wait before emitting the event
	 *
	 * @type {Number}
	 * @default 500
	 * @memberof limestone/internal/DebounceDecorator.DebounceDecorator.defaultConfig
	 */
	delay: 500
};

/**
 * Provides common means of delaying an event response, like throttling
 *
 * This is useful if events are flooding in too quickly to efficiently handle. This lets you ignore
 * events occurring after `delay` of milliseconds.
 *
 * @class DebounceDecorator
 * @memberof limestone/internal/DebounceDecorator
 * @hoc
 * @private
 */
const DebounceDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {cancel, debounce, delay} = config;

	// eslint-disable-next-line no-shadow
	const DebounceDecorator = (props) => {
		checkPropTypes(DebounceDecorator, props);

		// The debounced event is emitted after a delay so it must use the latest props
		const propsRef = useRef(props);

		const job = useMemo(() => new Job((ev) => {
			const {[debounce]: onDebounce} = propsRef.current;

			if (onDebounce) {
				onDebounce(ev);
			}
		}, delay), []);

		useEffect(() => {
			propsRef.current = props;
		});

		useEffect(() => {
			return () => {
				job.stop();
			};
		}, [job]);

		const handleEvent = useCallback((ev) => {
			job.start(ev);
		}, [job]);

		const handleCancel = useCallback((ev) => {
			const {[cancel]: onCancel} = propsRef.current;

			if (onCancel) {
				onCancel(ev);
			}
			job.stop();
		}, [job]);

		const handlers = {};
		if (debounce) handlers[debounce] = handleEvent;
		if (cancel) handlers[cancel] = handleCancel;

		return (
			<Wrapped {...props} {...handlers} />
		);
	};

	DebounceDecorator.displayName = 'DebounceDecorator';

	DebounceDecorator.propTypes = /** @lends limestone/internal/DebounceDecorator.DebounceDecorator.prototype */ {
		/**
		 * Handler for `onChange` events
		 *
		 * `'onChange'` can be changed to a different prop name by specifying the `debounce`
		 * config option.
		 *
		 * @see {@link limestone/internal/DebounceDecorator.DebounceDecorator.defaultConfig#debounce}
		 * @name onChange
		 * @memberof limestone/internal/DebounceDecorator.DebounceDecorator.prototype
		 * @type {Function}
		 * @public
		 */
		[debounce]: PropTypes.func
	};

	return DebounceDecorator;
});

export default DebounceDecorator;
export {DebounceDecorator};
