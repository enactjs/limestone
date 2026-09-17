import hoc from '@enact/core/hoc';
import {createContext, use, type ReactNode} from 'react';
import pick from 'ramda/src/pick';
import omit from 'ramda/src/omit';

const PanelsStateContext = createContext<Record<string, any> | null>(null);

const sharedContextProps = [
	'backButtonAriaLabel',
	'backButtonBackgroundOpacity',
	'closeButtonAriaLabel',
	'closeButtonBackgroundOpacity',
	'noBackButton',
	'noCloseButton',
	'onBack',
	'onClose'
];

// Given a full collection of props, return just the props from the shared list.
const getSharedProps = (props: Record<string, any>): Record<string, any> => {
	return pick(sharedContextProps, props);
};

// Remove these shared props from the props object
const deleteSharedProps = (props: Record<string, any>): void => {
	sharedContextProps.forEach(key => {
		delete props[key];
	});
};

function useContextAsDefaults (props: Record<string, any>) {
	const ctx = use(PanelsStateContext);

	const contextProps = {...ctx, ...getSharedProps(props)};

	const provideContextAsDefaults = (children: ReactNode) => {
		return (
			<PanelsStateContext value={contextProps}>
				{children}
			</PanelsStateContext>
		);
	};

	return {
		contextProps,
		provideContextAsDefaults
	};
}

const defaultConfig = {
	// Array of prop names to add to the Wrapped component.
	props: []
};

const ContextAsDefaults = hoc(defaultConfig, (config, Wrapped) => {
	// eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
	return function ContextAsDefaults (props: Record<string, any>) {
		const {contextProps, provideContextAsDefaults} = useContextAsDefaults(props);

		// The following generates a complete list of all the props expected by Wrapped
		// Using `pick`, add the specifically requested shared context props
		// Using `omit`, exclude all the shared props
		return provideContextAsDefaults(
			<Wrapped
				{...pick(config.props, contextProps)}
				{...omit(sharedContextProps, props)}
			/>
		);
	};
});

export {
	ContextAsDefaults,
	useContextAsDefaults,
	getSharedProps,
	deleteSharedProps
};
