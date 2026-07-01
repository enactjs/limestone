import Button from '../../../../Button';
import ContextualMenuDecorator from '../../../../ContextualMenuDecorator';

import {withConfig} from './utils';

const ContextualMenuButton = ContextualMenuDecorator(Button);
const popupProps = {
	style: {width: '500px'}
};
const menuItems = ['Item 1', 'Item 2', 'Item 3'];

const wrapper = {
	padded: '540px'
};

const contextualMenuDirectionTests = [
	// directions
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="above">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="above center">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="above left">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="above right">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="below">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="below center">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="below left">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="below right">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="left top">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="left middle">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="left bottom">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="right top">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="right middle">Button</ContextualMenuButton>,
	<ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="right bottom">Button</ContextualMenuButton>
];

const contextualMenuSmokeTests = [
	// closed
	<ContextualMenuButton open={false}>Button</ContextualMenuButton>,

	...contextualMenuDirectionTests,

	// offset - none
	<ContextualMenuButton offset="none" popupProps={popupProps} menuItems={menuItems} open direction="above center">Button</ContextualMenuButton>,

	// offset - small
	<ContextualMenuButton offset="small" popupProps={popupProps} menuItems={menuItems} open direction="above center">Button</ContextualMenuButton>,

	// offset - large
	<ContextualMenuButton offset="large" popupProps={popupProps} menuItems={menuItems} open direction="above center">Button</ContextualMenuButton>,

	// popupWidth - large
	<ContextualMenuButton popupWidth="large" popupProps={popupProps} menuItems={menuItems} open direction="above center">Button</ContextualMenuButton>,

	// *************************************************************
	// locale = 'ar-SA'
	// *************************************************************
	{
		locale: 'ar-SA',
		component: <ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="above center">Button</ContextualMenuButton>
	},
	{
		locale: 'ar-SA',
		component: <ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="below center">Button</ContextualMenuButton>
	},
	{
		locale: 'ar-SA',
		component: <ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="left middle">Button</ContextualMenuButton>
	},
	{
		locale: 'ar-SA',
		component: <ContextualMenuButton popupProps={popupProps} menuItems={menuItems} open direction="right middle">Button</ContextualMenuButton>
	}
];

const ContextualMenuDecoratorTests = [
	...withConfig({wrapper}, contextualMenuSmokeTests)
];

export default ContextualMenuDecoratorTests;
