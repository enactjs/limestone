import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, object, select, text} from '@enact/storybook-utils/addons/controls';
import Tooltip from '../../../../Tooltip/Tooltip';
import Button from '../../../../Button/Button';
import {svgGenerator} from "../helper/svg";

Tooltip.displayName = 'Tooltip';

export default {
    title: 'Limestone/Tooltip',
    component: 'Tooltip'
};

const TooltipButton = Tooltip(Button);

const Config = mergeComponentMetadata('Tooltip', Tooltip);

const src = {
    hd: svgGenerator(200, 200, '7ed31d', 'ffffff', '200 X 200'),
    fhd: svgGenerator(300, 300, '7ed31d', 'ffffff', '300 X 300'),
    uhd: svgGenerator(600, 600, '7ed31d', 'ffffff', '600 X 600')
};


export const _Tooltip = (args) => (
    <TooltipButton
        forceOpen={args['forceOpen']}
        marquee={args['marquee']}
        direction={args['direction']}
        text={args['text']}
        src={args['hasImage'] ? args['src'] : undefined}
    >
        Click me
    </TooltipButton>
);

boolean('forceOpen', _Tooltip);
boolean('marquee', _Tooltip);
boolean('hasImage', _Tooltip, false);
text('text', _Tooltip);
select('direction', _Tooltip, ['below', 'above', 'right', 'left']);
object('src', _Tooltip, Config, src);


_Tooltip.storyName = 'Tooltip';
_Tooltip.parameters = {
    info: {
        text: 'The basic Tooltip'
    }
};
