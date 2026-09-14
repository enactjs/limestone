/**
 * Provides Limestone styled Image component that supports multiple resolution sources.
 *
 * @example
 * <Image src="https://dummyimage.com/64/e048e0/0011ff" style={{height: 64, width: 64}} />
 *
 * @module limestone/Image
 * @exports Image
 * @exports ImageBase
 * @exports ImageDecorator
 */

import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import {checkPropTypes} from '@enact/core/util';
import {ImageBase as UiImageBase} from '@enact/ui/Image';
import EnactPropTypes, {EnactPropTypeShapes} from '@enact/core/internal/prop-types';
import ForwardRef from '@enact/ui/ForwardRef';
import Pure from '@enact/ui/internal/Pure';
import {selectSrc} from '@enact/ui/resolution';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {useEffect, useState} from 'react';
import type {ComponentType} from 'react';

import Skinnable from '../Skinnable';

import componentCss from './Image.module.less';

export interface ImageBaseProps {
	componentRef?: EnactPropTypeShapes.ref;
	css?: Record<string, string>;
	[key: string]: any;
}

/**
 * A Limestone-styled image component without any behavior
 *
 * @class ImageBase
 * @memberof limestone/Image
 * @extends ui/Image.Image
 * @ui
 * @public
 */
const ImageBase = kind({
	name: 'Image',

	_propTypes: {} as ImageBaseProps,

	propTypes: /** @lends limestone/Image.ImageBase.prototype */ {
		/**
		 * Called with a reference to the root component.
		 *
		 * When using {@link limestone/Image.Image}, the `ref` prop is forwarded to this component
		 * as `componentRef`.
		 *
		 * @type {Object|Function}
		 * @public
		 */
		componentRef: EnactPropTypes.ref as PropTypes.Validator<EnactPropTypeShapes.ref | undefined>,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `image` - The root component class for Image
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object as PropTypes.Validator<Record<string, string> | undefined>
	},

	styles: {
		css: componentCss,
		publicClassNames: ['image']
	},

	render: ({css, componentRef, ...rest}: Record<string, any>) => {
		return (
			UiImageBase.inline!({
				draggable: 'false',
				...rest,
				componentRef,
				css
			}, void 0 as any)
		);
	}
});


// This induces a render when there is a screen size change that has a corresponding image src value
// associated with the new screen size. The render is kicked off by remembering the new image src.
//
// This hoc could (should) be rewritten at a later time to use a smarter context API and callbacks,
// or something like pub/sub; each of which would be hooked together from the resolution.js that
// would coordinate any screen size/orientation changes and emit events from there.
//
// This is ripe for refactoring, and could probably move into UI to be generalized, but that's for
// another time. -B 2018-05-01
const ResponsiveImageDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
	const ResponsiveImageDecorator = (props: Record<string, any>) => {
		checkPropTypes(ResponsiveImageDecorator, props);

		const [, setSrc] = useState(selectSrc(props.src));

		useEffect(() => {
			const handleResize = () => {
				setSrc(selectSrc(props.src));
			};

			window.addEventListener('resize', handleResize);
			return () => {
				window.removeEventListener('resize', handleResize);
			};
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		return <Wrapped {...props} />;
	};

	ResponsiveImageDecorator.displayName = 'ResponsiveImageDecorator';
	ResponsiveImageDecorator.propTypes = {
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	};

	return ResponsiveImageDecorator;
});

/**
 * Limestone-specific behaviors to apply to {@link limestone/Image.ImageBase|Image}.
 *
 * @hoc
 * @memberof limestone/Image
 * @mixes limestone/Skinnable.Skinnable
 * @public
 */
const ImageDecorator = compose(
	ForwardRef({prop: 'componentRef'}),
	Pure,
	ResponsiveImageDecorator,
	Skinnable
);

/**
 * A Limestone-styled image component
 *
 * ```
 * <Image
 *   src={{
 *     'hd': 'https://dummyimage.com/64/e048e0/0011ff',
 *     'fhd': 'https://dummyimage.com/128/e048e0/0011ff',
 *     'uhd': 'https://dummyimage.com/256/e048e0/0011ff'
 *   }}
 * >
 * ```
 *
 * @class Image
 * @memberof limestone/Image
 * @extends limestone/Image.ImageBase
 * @mixes limestone/Image.ImageDecorator
 * @ui
 * @public
 */
const Image = ImageDecorator(ImageBase) as ComponentType<any>;


export default Image;
export {
	Image,
	ImageBase,
	ImageDecorator
};
