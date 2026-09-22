/* eslint-disable react-hooks/rules-of-hooks */
/**
 * Limestone component to allow the user to choose a color.
 *
 * @example
 * <ColorPicker
 *	 color={'#FF00FF'}
 *	 colorHandler={setColor}
 *	 presetColors={['#FF0000', '#00FF00', '#0000FF']}
 *	 text={'Color Picker'}
 * />
 *
 * @module limestone/ColorPicker
 * @exports ColorPicker
 * @exports ColorPickerBase
 * @exports ColorPickerDecorator
 * @private
 */

import kind from '@enact/core/kind';
import {checkPropTypes} from '@enact/core/util';
import Spottable from '@enact/spotlight/Spottable';
import {Cell, Column, Row} from '@enact/ui/Layout';
import Toggleable from '@enact/ui/Toggleable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useCallback, useEffect, useReducer} from 'react';
import type {ComponentType} from 'react';

import BodyText from '../BodyText';
import Button, {ButtonBase} from '../Button';
import Icon from '../Icon';
import Item from '../Item';
import Popup from '../Popup';
import Skinnable from '../Skinnable';
import Slider from '../Slider';

import {hexToHSL, HSLToHex} from './utils';

import componentCss from './ColorPicker.module.less';

const SpottableButton = Spottable(ButtonBase);

interface PopupContentProps {
	color?: string;
	colorHandler?: (color: string) => void;
	css?: Record<string, string>;
	presetColors?: string[];
}

/**
 * A component that contains the content for the {@link limestone/ColorPicker|ColorPicker} popup.
 *
 * @class PopupContent
 * @memberof limestone/ColorPicker
 * @ui
 * @private
 */
const PopupContent = (props: PopupContentProps) => {
	checkPropTypes(PopupContent, props);

	const {color, colorHandler, css, presetColors} = props;

	const reducer = (reducerState: Record<string, any>, payload: Record<string, any>) => {
		return {...reducerState, ...payload};
	};

	const createInitialState = () => {
		return {
			hue: 0,
			saturation: 0,
			lightness: 0
		};
	};

	const [state, dispatch] = useReducer(reducer, null, createInitialState);
	const {hue, saturation, lightness} = state;

	useEffect(() => {
		const {h, s, l} = hexToHSL(color ?? '');

		dispatch({hue: h, saturation: s, lightness: l});
	}, [color]);

	const changeHue = useCallback((ev: any) => {
		dispatch({hue: ev.value});
	}, []);

	const changeLightness = useCallback((ev: any) => {
		dispatch({lightness: ev.value});
	}, []);

	const changeSaturation = useCallback((ev: any) => {
		dispatch({saturation: ev.value});
	}, []);

	const handleClick = useCallback((ev: any) => {
		colorHandler?.(ev.target.offsetParent.id);
	}, [colorHandler]);

	const onSliderValueChange = useCallback(() => {
		colorHandler?.(HSLToHex(hue, saturation, lightness));
	}, [colorHandler, hue, lightness, saturation]);

	return (
		<Cell className={css?.colorPicker}>
			<Row className={css?.colorsRow} wrap>
				{presetColors?.map((presetColor, presetColorIndex) => {

					return (
						<Cell key={presetColor + '-' + presetColorIndex} size="25%">
							<SpottableButton
								className={css?.coloredButton}
								id={presetColor}
								minWidth={false}
								onClick={handleClick}
								style={{backgroundColor: presetColor}}
								type="color"
							/>
						</Cell>
					);
				})}
			</Row>
			<div>
				<Column className={css?.colorPickerSliders}>
					<BodyText className={css?.colorSliderText} css={css}>Hue {hue}</BodyText>
					<Slider
						className={css?.colorSlider}
						max={356}
						min={0}
						onBlur={onSliderValueChange}
						onClick={onSliderValueChange}
						onChange={changeHue}
						value={hue}
					/>
					<BodyText className={css?.colorSliderText} css={css}>Saturation {saturation}%</BodyText>
					<Slider
						className={css?.colorSlider}
						max={100}
						min={0}
						onBlur={onSliderValueChange}
						onClick={onSliderValueChange}
						onChange={changeSaturation}
						value={saturation}
					/>
					<BodyText className={css?.colorSliderText} css={css}>Lightness {lightness}%</BodyText>
					<Slider
						className={css?.colorSlider}
						max={100}
						min={0}
						onBlur={onSliderValueChange}
						onClick={onSliderValueChange}
						onChange={changeLightness}
						value={lightness}
					/>
				</Column>
				<div className={css?.coloredDiv} style={{backgroundColor: `hsl(${hue} ,${saturation}%, ${lightness}%)`}} />
			</div>
		</Cell>
	);
};

PopupContent.propTypes = {
	color: PropTypes.string,
	colorHandler: PropTypes.func,
	css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
	presetColors: PropTypes.array as PropTypes.Validator<string[] | undefined>
};

export interface ColorPickerBaseProps {
	color?: string;
	colorHandler?: (color: string) => void;
	css?: Record<string, string>;
	disabled?: boolean;
	onTogglePopup?: (...args: any[]) => any;
	popupOpen?: boolean;
	presetColors?: string[];
	text?: string;
}

/**
 * The color picker base component which sets-up the component's structure.
 *
 * @class ColorPickerBase
 * @memberof limestone/ColorPicker
 * @ui
 * @private
 */
const ColorPickerBase = kind({
	name: 'ColorPicker',

	functional: true,

	_propTypes: {} as ColorPickerBaseProps,

	propTypes: /** @lends limestone/ColorPicker.ColorPickerBase.prototype */ {
		color: PropTypes.string,
		colorHandler: PropTypes.func,
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>,
		disabled: PropTypes.bool,
		onTogglePopup: PropTypes.func,
		popupOpen: PropTypes.bool,
		presetColors: PropTypes.array as PropTypes.Validator<string[] | undefined>,
		text: PropTypes.string
	},

	handlers: {
		handleClosePopup: (ev, {onTogglePopup}) => {
			onTogglePopup();
		},
		handleOpenPopup: (ev, {disabled, onTogglePopup}) => {
			if (!disabled) {
				onTogglePopup();
			}
		}
	},

	styles: {
		css: componentCss,
		publicClassNames: true
	},

	render: ({color, colorHandler, css, disabled = false, handleClosePopup, handleOpenPopup, popupOpen = false, presetColors, text, ...rest}) => {
		const restProps = rest as Record<string, any>;
		delete restProps.onTogglePopup;

		const CloseIcon = useCallback((props: Record<string, any>) => <Icon {...props} css={css} />, [css]);
		const slotAfter = <SpottableButton
			className={css!.coloredButton}
			disabled={disabled}
			onClick={handleOpenPopup}
			style={{backgroundColor: color}}
			type="color"
		/>;

		return (
			<Cell shrink className={css!.colorPicker}>
				<Item disabled={disabled} onClick={handleOpenPopup} slotAfter={slotAfter} {...restProps}>
					{text}
				</Item>
				<Popup
					className={css!.colorPopup}
					css={css}
					noAnimation
					onClose={handleClosePopup}
					open={disabled ? false : popupOpen}
					position="left"
					scrimType="transparent"
				>
					<Row>
						<Cell align="center">
							<BodyText className={css!.colorPopupHeader} css={css} noWrap>{text}</BodyText>
						</Cell>
						<Cell align="right" shrink>
							<Button className={css!.closeButton} css={css} iconComponent={CloseIcon as any} icon="closex" onClick={handleClosePopup} size="small" />
						</Cell>
					</Row>
					<PopupContent color={color} colorHandler={colorHandler} css={css} presetColors={presetColors} />
				</Popup>
			</Cell>
		);
	}
});

/**
 * Applies Limestone specific behaviors to {@link limestone/ColorPicker.ColorPickerBase|ColorPicker} components.
 *
 * @hoc
 * @memberof limestone/ColorPicker
 * @mixes limestone/Skinnable.Skinnable
 * @mixes ui/Toggleable.Toggleable
 * @private
 */
const ColorPickerDecorator = compose(
	Skinnable,
	Toggleable({prop: 'popupOpen', toggle: 'onTogglePopup'})
);

/**
 * A color picker component, ready to use in Limestone applications.
 *
 * @class ColorPicker
 * @memberof limestone/ColorPicker
 * @extends limestone/ColorPicker.ColorPickerBase
 * @mixes limestone/ColorPicker.ColorPickerDecorator
 * @ui
 * @private
 */
const ColorPicker = ColorPickerDecorator(ColorPickerBase) as ComponentType<ColorPickerBaseProps>;

export default ColorPicker;
export {
	ColorPicker,
	ColorPickerBase,
	ColorPickerDecorator
};
