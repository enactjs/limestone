import {isValidElement, cloneElement} from 'react';

const pick = (tests, ...indices) => indices.map(i => tests[i]).filter(t => t != null);

const withProps = (props, tests) => {
	return tests.map(t => {
		if (isValidElement(t)) {
			return cloneElement(t, props);
		}

		return {
			...t,
			component: cloneElement(t.component, props)
		};
	});
};

const withConfig = (config, tests) => {
	return tests.map(t => {
		if (isValidElement(t)) {
			return {
				...config,
				component: t
			};
		}

		return {
			...t,
			...config
		};
	});
};

const LoremString =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac tellus in velit ornare commodo. Nam dignissim fringilla nulla, sit amet hendrerit sapien laoreet quis. Praesent quis tellus non diam viverra feugiat.';

const LongerLoremString = `Longer ${LoremString} ${LoremString} ${LoremString} ${LoremString}`;

export {
	LongerLoremString,
	LoremString,
	pick,
	withConfig,
	withProps
};
