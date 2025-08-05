import kind from '@enact/core/kind';

import Skinnable from '../Skinnable';

import componentCss from './Motion.module.less'

const MotionBase = kind({

	styles: {
		css: componentCss
	},

	computed: {
		className: ({styler, triggerMotion, type}) => {
			return styler.append({[type]: triggerMotion});
		},
	},

	render: ({...rest}) => {
		delete rest.triggerMotion;

		return (
			<div {...rest} />
		);
	}
});

const Motion = Skinnable(MotionBase);

export default Motion;