import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {checkPropTypes, setDefaultProps} from '@enact/core/util';
import PropTypes from 'prop-types';
import {useCallback, useState} from 'react';

import BodyText from '../BodyText';
import ContextualPopupDecorator from '../ContextualPopupDecorator';
import Image from '../Image';

import componentCss from './Tooltip.module.less';

const defaultConfig = {noArrow: true};

const contextualPopupDecoratorDefaultProps = {
	direction: 'below center',
	forceOpen: false,
	marquee: false
};

const Tooltip = hoc(defaultConfig, (config, Wrapped) => {
	const ContextualWrapped = ContextualPopupDecorator(config, Wrapped);

	const TooltipComponent = (props) => {
		checkPropTypes(TooltipComponent, props);
		const componentProps = setDefaultProps(props, contextualPopupDecoratorDefaultProps);

		const [open, setOpen] = useState(false);
		const {direction, forceOpen, text, src, size, marquee, ...rest} = componentProps;

		const popupComponent = useCallback(() => {
			let style = {};
			if (size.height) style.height = size.height + 'px';
			if (size.width) style.width = size.width + 'px';

			return (
				<div className={componentCss.popupComponent}>
					{src && <Image className={componentCss.image} src={src} style={style} />}
					<BodyText className={componentCss.bodyText} noWrap={marquee}>{text}</BodyText>
				</div>
			);
		}, [marquee, size, src, text]);

		const onBlur = useCallback((ev) => {
			forward('onBlur', ev);
			setOpen(false);
		}, []);

		const onFocus = useCallback((ev) => {
			forward('onFocus', ev);
			setOpen(true);
		}, []);

		return (
			<ContextualWrapped
				noArrow
				direction={direction}
				onBlur={onBlur}
				onFocus={onFocus}
				open={open || forceOpen}
				popupComponent={popupComponent}
				popupCss={componentCss}
				{...rest}
			/>
		);
	};

	TooltipComponent.displayName = 'TooltipComponent';

	TooltipComponent.propTypes = {
		/**
         * Direction of popup with respect to the wrapped component.
         *
         * @type {('above center'|'below center'|'left middle'|'right middle')}
         * @default 'below center'
         * @public
         */
		direction: PropTypes.oneOf(['above center', 'below center', 'left middle', 'right middle']),

		/**
		 * Forces the tooltip to stay open.
		 *
		 * @type boolean
		 * @default false
		 * @public
		 */
		forceOpen: PropTypes.bool,

		/**
		 * Enables the tooltip text to marquee.
		 *
		 * @type boolean
		 * @default false
		 * @public
		 */
		marquee: PropTypes.bool,

		/**
		 * Size provided for the image
		 * @type object
		 * @public
		 */
		size: PropTypes.object,

		/**
		 * Image for display in tooltip
		 * @type object
		 * @public
		 */
		src: PropTypes.object,

		/**
		 * Text for display in tooltip
		 * @type string
		 * @public
		 */
		text: PropTypes.string
	};

	return TooltipComponent;
});

export default Tooltip;
