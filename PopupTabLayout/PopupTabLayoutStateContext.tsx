import {createContext} from 'react';

interface PopupTabLayoutState {
	type?: string;
}

export const PopupTabLayoutStateContext = createContext<PopupTabLayoutState>({});
