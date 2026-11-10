import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import useHandlers from '@enact/core/useHandlers';
import {setDefaultProps} from '@enact/core/util';
import Pause from '@enact/spotlight/Pause';
import PropTypes from 'prop-types';
import {useCallback, useLayoutEffect, useRef} from 'react';

const transitionDecoratorHandlers = {
	onHide: handle(
		forward('onHide'),
		(ev, props, {resume}) => {
			resume();
		}
	),
	onTransition: handle(
		forward('onTransition'),
		(ev, props, {resume}) => {
			resume();
		}
	),
	onWillTransition: handle(
		forward('onWillTransition'),
		(ev, props, {pause}) => {
			pause();
		}
	)
};

/**
 * A higher-order component that manages spotlight pause state for both popup and panels
 * transitions, generally used within PopupDecorator.
 *
 * @class TransitionDecorator
 * @hoc
 * @private
 * @memberof limestone/Panels
 */
const TransitionDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	const TransitionDecorator = (componentProps) => {
		const props = setDefaultProps(componentProps, TransitionDecorator.defaultProps || {});

		const paused = useRef(new Pause('TransitionDecorator'));

		const pause = useCallback(() => paused.current.pause(), []);
		const resume = useCallback(() => paused.current.resume(), []);

		const handlers = useHandlers(transitionDecoratorHandlers, props, {pause, resume});

		useLayoutEffect(() => {
			return () => {
				resume();
			};
		}, [resume]);

		return (
			<Wrapped
				{...props}
				onHide={handlers.onHide}
				onTransition={handlers.onTransition}
				onWillTransition={handlers.onWillTransition}
			/>
		);
	};

	TransitionDecorator.displayName = 'TransitionDecorator';
	TransitionDecorator.propTypes = /** @lends limestone/Panels.TransitionDecorator.prototype */ {
		/**
		 * Called after hide transition has completed, and immediately with no transition.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * Called once when all panels have completed their transition.
		 *
		 * @type {Function}
		 * @public
		 */
		onTransition: PropTypes.func,

		/**
		 * Called once before panels begin their transition.
		 *
		 * @type {Function}
		 * @public
		 */
		onWillTransition: PropTypes.func
	};

	return TransitionDecorator;
});

export default TransitionDecorator;
export {TransitionDecorator};
