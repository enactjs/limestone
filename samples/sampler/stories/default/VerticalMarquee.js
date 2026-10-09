import Spottable from '@enact/spotlight/Spottable';
import VerticalMarquee from '@enact/limestone/VerticalMarquee';
import Skinnable from '@enact/limestone/Skinnable';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, number, select, text} from '@enact/storybook-utils/addons/controls';
import ri from '@enact/ui/resolution';

import css from './VerticalMarquee.module.less';

const Config = mergeComponentMetadata('VerticalMarquee', VerticalMarquee);
const FocusableVerticalMarquee = Spottable(Skinnable(VerticalMarquee));

const longText = 'Vertical marquee proof of concept. This block is clipped to a few lines. When it receives focus and the text is taller than that area, it scrolls upward through the full content, pauses briefly, then repeats the cycle. The quick brown fox jumped over the lazy dog. The bean bird flies at sundown.';

export default {
	title: 'Limestone/Marquee vertical',
	component: 'VerticalMarquee'
};

export const _VerticalMarquee = (args) => {
	let marqueeSpacing = args['marqueeSpacing'];
	if (marqueeSpacing && String(marqueeSpacing).indexOf('%') === -1) {
		marqueeSpacing = Number.parseInt(marqueeSpacing);
	}

	const controls = {
		disabled: args['disabled'],
		maxLines: args['maxLines'],
		marqueeDelay: args['marqueeDelay'],
		marqueeDisabled: args['marqueeDisabled'],
		marqueeOn: args['marqueeOn'],
		marqueeOnRenderDelay: args['marqueeOnRenderDelay'],
		marqueeResetDelay: args['marqueeResetDelay'],
		marqueeSpacing,
		marqueeSpeed: args['marqueeSpeed']
	};

	const blockWidth = {width: ri.scaleToRem(800)};
	const frameStyle = {
		...blockWidth,
		flexShrink: 0,
		marginBottom: ri.scaleToRem(48)
	};

	return (
		<section>
			<p className={css.note}>
				The text scrolls one full cycle, like the horizontal Marquee, then pauses and repeats.
				Give the block a bounded width so the text wraps. Focus it when marqueeOn is focus.
			</p>
			<div style={frameStyle}>
				<p className={css.note}>Overflows maxLines</p>
				<FocusableVerticalMarquee {...controls} style={blockWidth}>
					{args['children']}
				</FocusableVerticalMarquee>
			</div>
			<div style={frameStyle}>
				<p className={css.note}>Fits in maxLines</p>
				<FocusableVerticalMarquee {...controls} style={blockWidth}>
					Short text.
				</FocusableVerticalMarquee>
			</div>
		</section>
	);
};

boolean('disabled', _VerticalMarquee, Config, false);
number('maxLines', _VerticalMarquee, Config, 3);
number('marqueeDelay', _VerticalMarquee, Config, 1000);
boolean('marqueeDisabled', _VerticalMarquee, Config, false);
select('marqueeOn', _VerticalMarquee, ['focus', 'hover', 'render'], Config, 'focus');
number('marqueeOnRenderDelay', _VerticalMarquee, Config, 1000);
number('marqueeResetDelay', _VerticalMarquee, Config, 1000);
text('marqueeSpacing', _VerticalMarquee, Config, '50%');
number('marqueeSpeed', _VerticalMarquee, Config, 30);
text('children', _VerticalMarquee, Config, longText);

_VerticalMarquee.storyName = 'Marquee vertical';
_VerticalMarquee.parameters = {
	info: {
		text: 'Vertical marquee for multi-line text that overflows maxLines'
	}
};
