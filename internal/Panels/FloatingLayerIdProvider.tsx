import hoc from '@enact/core/hoc';
import {useFloatingLayer} from '@enact/ui/FloatingLayer';

const defaultConfig = {};

const FloatingLayerIdProvider = hoc(defaultConfig, (config, Wrapped) => {
	// eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
	return function FloatingLayerIdProvider (props: Record<string, any>) {
		const {floatingLayerId} = useFloatingLayer();

		return (
			<Wrapped
				{...props}
				floatingLayerId={floatingLayerId}
			/>
		);
	};
});

export default FloatingLayerIdProvider;
export {FloatingLayerIdProvider};
