import {useRef, useCallback} from 'react';

function useToggleRole ({role = 'region', event = 'onWillTransition'}: {role?: string; event?: string} = {}) {
	const ref = useRef<HTMLElement | null>(null);

	const handler = useCallback(() => {
		if (ref.current) {
			// To workaround not reading title when panel transition ends
			ref.current.setAttribute('role', null as unknown as string);
			ref.current.setAttribute('role', role);
		}
	}, [ref, role]);

	return {
		ref,
		[event]: handler
	};
}

export default useToggleRole;
export {
	useToggleRole
};
