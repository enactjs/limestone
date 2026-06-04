import hoc from '@enact/core/hoc';
import BodyText from '../BodyText';
import ContextualPopupDecorator from '../ContextualPopupDecorator';
import Image from '../Image';
import {useCallback, useState} from "react";
import {forward} from '@enact/core/handle';
import componentCss from './Tooltip.module.less';

const defaultConfig = {noArrow: true};

const Tooltip = hoc(defaultConfig, (config, Wrapped) => {
    const ContextualWrapped = ContextualPopupDecorator(config, Wrapped);

    const TooltipComponent = (props) => {
        const [open, setOpen] = useState(false);
        const {direction, forceOpen, text, src, size, marquee, ...rest} = props;

        const newDirection = () => {
            switch (direction) {
            case 'left': return 'left middle';
            case 'right': return 'right middle';
            case 'above': return 'above center';
            case 'below': return 'below center';
            default: return direction;
            }
        }


        const popupComponent = () => {
            return (
                <>
                    {src && <Image src={src} />}
                    <BodyText className={componentCss.bodyText} noWrap={marquee}>{text}</BodyText>
                </>
            )
        }

        const onFocus = useCallback((ev) => {
            forward('onFocus', ev);
            setOpen(true);
        }, []);

        const onBlur = useCallback((ev) => {
            forward('onBlur', ev);
            setOpen(false);
        }, []);

        return(
            <ContextualWrapped
                noArrow
                direction={newDirection()}
                popupClassName={componentCss.tooltip}
                onFocus={onFocus}
                onBlur={onBlur}
                {...rest}
                popupComponent={popupComponent}
                open={open || forceOpen}
            />
        )
    }

    return TooltipComponent;
});

export default Tooltip;