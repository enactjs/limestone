# Change Log

The following is a curated list of changes in the Enact limestone module, newest changes on the top.

## [3.0.0-alpha.4] - 2025-01-21

- Update dependencies including React 19.0.0

### Added

- `limestone/Icon` supported icon list, adding new icon `calibration`
- `limestone/Pageviews` `pageIndicatorPosition` prop to set the position of the page indicator

### Changed

- CSS variables with suffix '-rgb' to without suffix and its value to hex format

### Fixed

- `limestone/ContextualPopupDecorator` to update popup position properly when the DOM tree changes
- `limestone/Scroller` to focus properly when the spottable node is bigger than the size of viewport by voice control
- `limestone/Scroller` to prevent the native scrolling behavior caused by keydown events when a popup is open
- `limestone/TooltipDecorator` to hide a tooltip when tapping outside of disabled component

## [2.9.7] - 2025-01-16

### Fixed

- `limestone/ContextualPopupDecorator` to update popup position properly when the DOM tree changes

## [2.7.21] - 2024-12-31

### Fixed

- `limestone/Scroller` with `editable` prop to support touch input
- `limestone/TooltipDecorator` to hide a tooltip when tapping outside of disabled component

## [2.7.20] - 2024-12-17

### Added

- `limestone/Icon` supported icon list, adding new icon `calibration`

## [2.9.6] - 2024-12-11

### Added

- `limestone/Icon` supported icon list, adding new icon `calibration`

### Changed

- `limestone/QuickGuidePanels` to read out more details according to the latest UX guide

### Fixed

- `limestone/Scroller` to focus properly when the spottable node is bigger than the size of viewport by voice control
- `limestone/Scroller` to prevent the native scrolling behavior caused by keydown events when a popup is open

## [3.0.0-alpha.3] - 2024-12-02

### Added

- `limestone/Icon` supported icon list, adding new icons `ai`, `alert01`, and `alert02`
- `limestone/PageViews` prop `autoFocus` to set whether focus element automatically or not
- `limestone/PageViews.Page` and `limestone/QuickGuidePanels.Panel` prop `aria-label`
- `limestone/QuickGuidePanels` props `closeButtonAriaLabel` and `onClose`

### Fixed

- `limestone/ContextualPopupDecorator` to update popup position properly when the screen orientation change
- `limestone/IconItem` to restart marquee after done editing in `limestone/Scroller` with `editable` prop
- `limestone/Input` keypad layout when `type` prop is `number` or `passwordnumber` and the screen is in portrait mode or `popupType` prop is `overlay` and in large text mode
- `limestone/PageViews` and `limestone/QuickGuidePanels` dot page indicators to be aligned center
- `limestone/PageViews` to not clip the shadow of navigation buttons when `fullContents` prop is `true`
- `limestone/Scroller` to focus content area properly on supported platforms when `focusableScrollbar` prop is `byEnter`
- `limestone/Scroller` with `editable` prop to move an item via 5-way keys properly in pointer mode
- `limestone/Slider` to not show console error when dragging with touch

## [2.9.5] - 2024-11-19

### Added

- `limestone/Icon` supported icon list, adding new icons `ai`, `alert01`, and `alert02`

### Fixed

- `limestone/ContextualPopupDecorator` to update popup position properly when the screen orientation change
- `limestone/Input` keypad layout when `type` prop is `number` or `passwordnumber` and the screen is in portrait mode or `popupType` prop is `overlay` and in large text mode
- `limestone/Slider` to not show console error when dragging with touch

## [2.7.19] - 2024-11-15

### Fixed

- `limestone/ContextualPopupDecorator` to update popup position properly when the screen orientation change
- `limestone/Input` keypad layout when `type` prop is `number` or `passwordnumber` and the screen is in portrait mode or `popupType` prop is `overlay` and in large text mode

## [2.9.4] - 2024-10-29

### Fixed

- `limestone/IconItem` to restart marquee after done editing in `limestone/Scroller` with `editable` prop
- `limestone/PageViews` and `limestone/QuickGuidePanels` dot page indicators to be aligned center
- `limestone/Scroller` to focus content area properly on supported platforms when `focusableScrollbar` prop is `byEnter`
- `limestone/Scroller` with `editable` prop to move an item via 5-way keys properly in pointer mode

## [2.9.3] - 2024-10-15

### Added

- `limestone/MediaControls` props `jumpBackwardAriaLabel` and `jumpForwardAriaLabel` to override aria-label of jumpButtons
- `limestone/PageViews` prop `autoFocus` to set whether focus element automatically or not

### Fixed

- `limestone/PageViews` to not clip the shadow of navigation buttons when `fullContents` prop is `true`
- `limestone/Scroller` to focus the topmost element after scroll by voice control
- `limestone/Scroller` to read out properly when `limestone/Panels` has `limestone/Scroller` with `focusableScrollbar`
- `limestone/VideoPlayer` to show only the mini feedback when pressing play/pause key

## [3.0.0-alpha.2] - 2024-10-08

### Added

- `limestone/Alert` public class names `alert`, `content`, `fullscreen`, and `title`
- `limestone/MediaControls` props `jumpBackwardAriaLabel` and `jumpForwardAriaLabel` to override aria-label of jumpButtons
- `limestone/Steps` prop `highlightCurrentOnly` to highlight and scale only the current step

### Changed

- `limestone/Icon` supported icon list, adding new icons

### Fixed

- `limestone/Panels.Header` to show title and subtitle properly in `limestone/WizardPanels`
- `limestone/Scroller`, `limestone/Slider`, and `limestone/VirtualList` to have default prop when `undefined` prop is passed
- `limestone/Scroller` to show scroll indicator when `focusableScrollbar` prop is `true`
- `limestone/Scroller` to focus the topmost element after scroll by voice control
- `limestone/Scroller` to read out properly when `limestone/Panels` has `limestone/Scroller` with `focusableScrollbar`
- `limestone/Steps` prop `size` to accept number type
- `limestone/VideoPlayer` to show only the mini feedback when pressing play/pause key

## [2.9.2] - 2024-09-26

### Fixed

- `limestone/Panels.Header` to show title and subtitle properly in `limestone/WizardPanels`
- `limestone/Scroller` to show scroll indicator when `focusableScrollbar` prop is `true`

## [2.9.1] - 2024-09-09

### Added

- `limestone/Alert` public class names `alert`, `content`, `fullscreen`, and `title`
- `limestone/Steps` prop `highlightCurrentOnly` to highlight and scale only the current step

### Changed

- `limestone/Icon` supported icon list, adding new icons

### Fixed

- `limestone/Scroller`, `limestone/Slider`, and `limestone/VirtualList` to have default prop when `undefined` prop is passed
- `limestone/Steps` prop `size` to accept number type

## [2.7.18] - 2024-09-05

### Added

- `limestone/Alert` public class names `alert`, `content`, `fullscreen`, and `title`

### Changed

- `limestone/Icon` supported icon list, adding new icons

## [2.9.0] - 2024-07-17

### Added

- `limestone/Scroller` `editable.blurItemFuncRef` prop to provide a function for blurring the focused item

### Changed

- `limestone/PageViews` styling to match the latest GUI

### Fixed

- `limestone/Input` back button to be disabled when `disabled` prop is `true`
- `limestone/Popup` to restore focus when a popup is open by default and then closed

## [3.0.0-alpha.1] - 2024-07-11

### Removed

- `limestone/Input.InputPopupBase` prop `value`

### Added

- `limestone/Scroller` `editable.blurItemFuncRef` prop to provide a function for blurring the focused item

### Changed

- `limestone/PageViews` styling to match the latest GUI

### Fixed

- `limestone/Input` back button to be disabled when `disabled` prop is `true`
- `limestone/Popup` to restore focus when a popup is open by default and then closed

## [2.9.0-beta.1] - 2024-06-17

### Added

- `limestone/Icon` supported icon list, adding new icon `create`

## [2.9.0-alpha.4] - 2024-06-05

### Changed

- `limestone/ContextualPopupDecorator` and `limestone/Dropdown` to have sibling DOM node as alternative to findDOMNode API which will be removed in React 19
- `limestone/PageViews` to hide dot page indicator when there is only one page

### Fixed

- `limestone/FixedPopupPanels` to show the outline appropriately in high-contrast mode

## [2.9.0-alpha.3] - 2024-05-24

### Added

- Support for QHD displays
- `limestone/Icon` supported icon list, adding new wifi5G icons
- `limestone/PageViews` prop `fullContents` to maximize its contents area

### Fixed

- `limestone/TabLayout` to move focus properly by 5-way directional key when it is in Panels
- `limestone/QuickGuidePanels` to export `Panel` instead of `QuickGuidePanel`

## [2.9.0-alpha.2] - 2024-04-22

### Added

- `limestone/ThemeDecorator.AccessibilityDecorator` prop `focusRing` to support focus ring to IcomItem and ImageItem

## [2.9.0-alpha.1] - 2024-04-09

### Added

- `limestone/PageViews` component
- `limestone/Scroller.ContentContainerDecorator` to allow component to be a scroll target when its descendant is focused
- `limestone/VideoPlayer` prop `setPlaybackSpeed` to support playback speed adjustment

### Changed

- Popup family components to enhance contrast in high-contrast mode for improved visibility

### Fixed

- `limestone/VirtualList` to show the focused item properly when switching from pointer mode to 5-way mode
- `limestone/VirtualList.VirtualGridList` to show the focused item fully when focus moves via 5-way keys inside a list

## [2.7.15] - 2024-03-05

### Added

- `limestone/Scroller.ContentContainerDecorator` to allow component to be a scroll target when its descendant is focused

### Fixed

- `limestone/VirtualList` to show the focused item properly when switching from pointer mode to 5-way mode
- `limestone/VirtualList.VirtualGridList` to show the focused item fully when focus moves via 5-way keys inside a list

## [2.8.0] - 2024-02.07

### Fixed

- `limestone/Scroller` with `editable` prop to remain focused on the selected item when completing edit by down or enter key in pointer mode
- `limestone/Scroller` not to forward `onBack` handler of `limestone/Panels` when focus moves from scroll thumb to BodyText via back key
- `limestone/VirtualList` to have proper scroll position when item with affordance is larger than scroll area

## [2.5.12] - 2024-02-02

### Fixed

- `limestone/WizardPanels` to read out the correct step when using `current` prop

## [2.7.14] - 2024-01-23

No significant changes.

## [2.7.13] - 2023-12-08

### Changed

- `limestone/Dropdown` to read out more details
- `limestone/Scroller` with `editable` prop to complete editing when 'down' key is pressed during editing
- `limestone/Slider` to read out more details
- `limestone/TabLayout` to move focus from tab contents to tab menu via back key
- `limestone/TabLayout` to read out more details

### Fixed

- `limestone/Scroller` with `editable` prop to rearrange items properly when moving pointer very fast
- `limestone/Scroller` with `editable` prop to complete editing when focus left by 5-way key in pointer mode

## [2.7.12] - 2023-10-23

### Fixed

- `limestone/Scroller` to read out the announcement of completion properly when `editable` is given

## [2.7.11] - 2023-10-13

### Fixed

- `limestone/TabLayout` to revert 2.7.9 fix that change back key behavior

## [2.7.10] - 2023-09-20

### Fixed

- `limestone/Scroller` to not show console error when an abnormal `editable.initialSelected` is given
- `limestone/VirtualList` to not snatch focus from other list on the first render

## [2.7.9] - 2023-09-12

### Changed

- `limestone/TabLayout` back key behavior to match the latest UX

### Fixed

- `limestone/Panels.Header` to not show `slotAfter` in incorrect position at first rendering when `centered` is given
- `limestone/Scroller` to read out properly when `editable` is given

## [2.7.8] - 2023-08-31

### Changed

- `limestone/IconItem` to match the latest design

### Fixed

- `limestone/QuickGuidePanels` to focus the last focused button when navigating between views

## [2.7.7] - 2023-08-22

### Added

- `limestone/QuickGuidePanels` read out feature to support A11y

### Fixed

- `limestone/Scroller` to support hiding all items when `editable` is given
- `limestone/Scroller` to not lose focus by back key when `editable` is given

## [2.7.6] - 2023-08-10

### Changed

- `limestone/TabLayout` enter key behavior to match the latest UX

### Fixed

- `limestone/Dropdown` to focus properly the first option and the last option via page up and page down
- `limestone/QuickGuidePanels` to not lose focus when the last view is displayed

## [2.7.5] - 2023-08-04

### Added

- `limestone/Scroller` prop `editable.initialSelected` to allow start edit mode with selected item

### Changed

- `limestone/Scroller` back key behavior to match the latest UX when `editable` is given

### Fixed

- `limestone/Scroller` to handle focus moving properly when `editable` is given
- `limestone/Scroller` to not select disabled item in scroller when `editable` is given
- `limestone/VirtualList` to move focus properly by 5-way directional key hold when `spotlight/SpotlightContainerDecorator` config option `continue5WayHold` is set

## [2.7.4] - 2023-07-19

### Fixed

- `limestone/VirtualList.VirtualGridList` to not scale DOM out of a list by wheeling when `snapToCenter`

## [2.7.3] - 2023-07-14

### Fixed

- `limestone/Scroller` and `limestone/VirtualList` to scroll properly by hovering inside a nested scroller

## [2.7.2] - 2023-06-30

### Added

- `limestone/Icon` supported icon list, adding new icons `exclamation`, `show`, and `hide`
- `limestone/Scroller` to support showing buttons when an item is focused and `editable` is given
- `limestone/QuickGuidePanels` prop `onClose`

### Fixed

- `limestone/QuickGuidePanels` to update a close button position properly in RTL locales
- `limestone/Scroller` to focus properly when item is selected and `editable` is given
- `limestone/VirtualList` to not lose focus when a focused item is removed by reduced `dataSize`

## [2.5.11] - 2023-06-07

### Fixed

- `limestone/VideoPlayer` to keep showing media controls while a user is wheeling

## [2.7.1] - 2023-06-02

### Added

- `limestone/Scroller` to support hiding items when `editable` is given
- `limestone/QuickGuidePanels` component

### Fixed

- `limestone/Scroller` and `limestone/VirtualList` to stop scrolling by `hoverToScroll` when the pointer disappears
- `limestone/VideoPlayer` to focus the play/pause button when the playback controls is shown using the 5-way down key
- `limestone/VideoPlayer` to keep showing media controls while a user is wheeling
- `limestone/WizardPanels` to read out the correct step when using `current` prop

## [2.7.0] - 2023-04-25

### Added

- `limestone/IconItem` component

### Changed

- `limestone/Alert` alignment of text content to be left for fullscreen type

### Fixed

- `limestone/Picker` to include `type` in the event payload for `onChange`
- `limestone/Scroller` and `limestone/VirtualList` to handle focus properly via page up at the first page and page down at the last page
- `limestone/WizardPanels` to restore focus properly after a transition

## [2.5.10] - 2023-04-13

### Fixed

- `limestone/Scroller` and `limestone/VirtualList` to handle focus properly via page up at the first page and page down at the last page

## [2.6.3] - 2023-03-17

### Added

- `limestone/Button` and `limestone/Panels.Header` prop `shadowed` to add shadow to text and buttons
- `limestone/Icon` supported icon list, adding a new icon `wowcast`

## [2.5.9] - 2023-03-16

### Added

- `limestone/Button` and `limestone/Panels.Header` prop `shadowed` to add shadow to text and buttons
- `limestone/Icon` supported icon list, adding a new icon `wowcast`

## [2.6.2] - 2023-03-09

### Added

- `limestone/Button` prop `roundBorder`, to make both sides of button fully rounded

### Fixed

- `limestone/DayPicker` to handle number typed `selected` prop properly in es-ES locale

## [2.6.1] - 2023-02-03

### Deprecated

- `limestone/Input.InputPopupBase` prop `value`, to be removed in 3.0.0. Use `defaultValue` instead.

### Added

- `limestone/ActionGuide` prop `buttonAriaLabel` and `limestone/MediaControls` prop `actionGuideButtonAriaLabel` to override aria-label of `ActionGuide` button
- `limestone/Icon` supported icon list, adding new icons `keymouse`, `keymousedis`, `camera`, `cameradis`, `gamepad`, and `gamepaddis`
- `limestone/Input.InputPopupBase` prop `defaultValue` to provide the initial value

### Changed

- `limestone/ActionGuide` to replace `Icon` with `Button`
- `limestone/VideoPlayer` to not expand video player using key down via 5way
- `limestone/Scroller` and `limestone/VirtualList` scroll speed and hover area when `hoverToScroll` is `true` to match GUI

### Fixed

- `limestone/Input` to read out properly after closing it in a `limestone/PopupTabLayout`
- `limestone/MediaPlayer.MediaControls` to disable buttons when hidden
- `limestone/MediaPlayer.MediaControls` to show round buttons correctly in high-contrast mode
- `limestone/TabLayout` to not cropped and apply orientation properly when `orientation` prop is vertical

## [2.5.8] - 2023-01-31

### Fixed

- `limestone/MediaPlayer.MediaControls` to show round buttons correctly in high-contrast mode

## [2.5.7] - 2023-01-03

### Changed

- `limestone/Scroller` and `limestone/VirtualList` scroll speed and hover area when `hoverToScroll` is `true` to match GUI

### Fixed

- `limestone/MediaPlayer.MediaControls` to disable buttons when hidden
- `limestone/Scroller` to not stop scrolling by hover unexpectedly when `hoverToScroll` is `true`

## [2.0.13] - 2022-12-23

### Fixed

- `limestone/MediaPlayer.MediaControls` to disable buttons when hidden

## [2.5.6] - 2022-12-13

### Added

- `limestone/ActionGuide` prop `buttonAriaLabel` and `limestone/MediaControls` prop `actionGuideButtonAriaLabel` to override aria-label of `ActionGuide` button
- `limestone/Icon` supported icon list, adding new icons `keymouse`, `keymousedis`, `camera`, `cameradis`, `gamepad`, and `gamepaddis`

### Changed

- `limestone/ActionGuide` to replace `Icon` with `Button`
- `limestone/VideoPlayer` to not expand video player using key down via 5way

## [2.0.12] - 2022-12-13

### Added

- `limestone/ActionGuide` prop `buttonAriaLabel` and `limestone/MediaControls` prop `actionGuideButtonAriaLabel` to override aria-label of `ActionGuide` button

### Changed

- `limestone/ActionGuide` to replace `Icon` with `Button`
- `limestone/VideoPlayer` to not expand video player using key down via 5way

## [2.6.0] - 2022-12-05

### Removed

- `@sand-inputfield-focus-text-color-rgb`, `@sand-picker-joined-fingernail-border-color`, `@sand-progress-buffer-color`, and `--sand-progress-buffer-color` as they are not used anymore

### Added

- `limestone/FormCheckboxItem` CSS variable `--sand-formcheckboxitem-focus-text-color` for a customization of the focused text color

### Changed

- `--sand-checkbox-disabled-selected-color` to `--sand-checkbox-disabled-selected-text-color`
- `@sand-alert-overlay-checkbox-disabled-selected-color` to `@sand-alert-overlay-checkbox-disabled-selected-text-color`

### Fixed

- `limestone/ImageItem` to have proper size when imported with `limestone/Dropdown` or `limestone/VirtualList` in the same file

## [2.0.11] - 2022-10-13

### Fixed

- `limestone/MediaPlayer.MediaControls` to focus properly when pressing up key from buttons after holding left or right keys
- `limestone/Scroller` and `limestone/VirtualList` to scroll properly by hover when scrollbar is hidden or `dataSize` is changed
- `limestone/Scroller` and `limestone/VirtualList` to scroll properly by hover when `hoverToScroll` is `true` and `scrollMode` is `translate`

## [2.5.5] - 2022-10-07

### Fixed

- `limestone/MediaPlayer.MediaControls` to focus properly when pressing up key from buttons after holding left or right keys
- `limestone/Scroller` and `limestone/VirtualList` to scroll properly by hover when scrollbar is hidden or `dataSize` is changed

## [2.5.4] - 2022-09-23

### Fixed

- `limestone/Scroller` to not show the focus effect of the body in pointer mode when `focusableScrollbar` prop is `byEnter`
- `limestone/Slider` tooltip arrow to show properly
- `limestone/Input` text color for number type cell when disabled to match GUI

## [2.5.3] - 2022-08-30

### Added

- `limestone/Icon` supported icon list, adding a new icon `musicsrc`

### Fixed

- `limestone/VideoPlayer` to not seek infinitely when pointer moves while holding left or right key

## [2.0.10] - 2022-08-30

### Added

- `limestone/Icon` supported icon list, adding a new icon `r2rappcall`
- `limestone/Icon` supported icon list, adding a new icon `musicsrc`

### Changed

- `limestone/TabLayout` to eliminate the horizontal maximum number of tabs

### Fixed

- `limestone/VideoPlayer` to not seek infinitely when pointer moves while holding left or right key

## [2.5.2] - 2022-08-17

No significant changes.

## [2.5.1] - 2022-08-03

### Added

- `limestone/Icon` supported icon list, adding a new icon `r2rappcall`

### Fixed

- `limestone/FixedPopupPanels` and `limestone/PopupTabLayout` to restore scroll position when going back to the previous panel by left key
- `limestone/Panels.Panel` to restore focus properly when it has `limestone/Scroller` with `focusableScrollbar`

## [2.5.0] - 2022-07-19

### Fixed

- `limestone/Scroller` and `limestone/VirtualList` to scroll properly by hover when `hoverToScroll` is `true` and `scrollMode` is `translate`

## [2.5.0-rc.2] - 2022-07-06

### Fixed

- `limestone/Alert` to show `limestone/ProgressBar` color properly
- `limestone/FixedPopupPanels`, `limestone/PopupTabLayout`, and `limestone/TabLayout` to move caret in InputField with left and right keys
- `limestone/WizardPanels` to provide `stopPropagation` method in `onBack` event payload

## [2.5.0-rc.1] - 2022-06-23

### Added

- `limestone/Scroller` read out feature to support A11y when `editable` is given

### Changed

- `limestone/Scroller` scrollbar thumb to read out "press ok button to read text" additionally when `focusableScrollbar` prop is `byEnter`
- `limestone/Scroller` scrollbar thumb to read out 'leftmost', 'rightmost', 'topmost', or 'downmost' when reaching the end of the scroll
- `limestone/Scroller` to select item by long press when `editable` is given
- `limestone/Picker` and `limestone/RangePicker` to read out `title`

### Fixed

- `limestone/Scroller` to position the focused item into scroller view

## [2.5.0-beta.1] - 2022-05-31

### Added

- `limestone/Panels.Header` and `limestone/WizardPanels` prop `noSubtitle` to hide subtitle area
- `limestone/Popup`, `limestone/PopupTabLayout`, `limestone/FixedPopupPanels`, and `limestone/FlexiblePopupPanels` to add `detail` property containing `inputType` in `onClose` event payload

### Changed

- `limestone/TabLayout` to eliminate the horizontal maximum number of tabs
- `limestone/Input` background color for number type cell, `limestone/Picker` indicator color when joined, and `limestone/ProgressBar` highlight color are updated for better visibility of `light` skin

### Fixed

- `limestone/ContextualPopupDecorator` to update the position of `ContextualPopup` properly when repositioned in open
- `limestone/FixedPopupPanels.Panel` body to be filled vertically to place the last children as intended
- `limestone/Scroller` to focus scroll thumb initially when it is used in Panels
- `limestone/Scroller` thresholds for swapping items by pointer when `editable` is given
- `limestone/Scroller` to support RTL locales when `editable` is given
- `limestone/Scroller` to scroll properly by wheel when `editable` is given
- `limestone/TimePicker` to forward `onComplete` event in RTL countries that do not display meridiem

## [2.0.9] - 2022-05-19

### Fixed

- `limestone/TimePicker` to forward `onComplete` event in RTL countries that do not display meridiem

## [2.5.0-alpha.2] - 2022-05-09

### Added

- `limestone/Alert` and `limestone/Input` support for portrait mode
- `limestone/Icon` supported icon list, adding a new icon `wallpaper`
- `limestone/Scroller` prop `editable` to enable editing items in the scroller

### Changed

- `limestone/Panels.Header` and `limestone/RadioItem` to use `onClick` instead of `onTap` for touch support

## [2.0.8] - 2022-04-25

### Added

- `limestone/Alert` and `limestone/Input` support for portrait mode
- `limestone/Icon` supported icon list, adding a new icon `wallpaper`
- `limestone/VideoPlayer` props `backButtonAriaLabel` and `onBack` to provide a way to exit video player via touch

### Changed

- `limestone/Panels.Header` and `limestone/RadioItem` to use `onClick` instead of `onTap` for touch support
- `limestone/DatePicker` and `limestone/TimePicker` to not show press effect via touch input
- `limestone/Scroller` and `limestone/VirtualList` to show overscroll effect when flicking

### Fixed

- `limestone/Picker` horizontal joined behavior going to the next item by touch

## [2.5.0-alpha.1] - 2022-04-15

- Update dependencies including React 18.0.0

### Changed

- `limestone/DatePicker` and `limestone/TimePicker` to not show press effect on touch input
- `limestone/ProgressBar` radial colors and `limestone/Scroller` colors to match with `limestone/ProgressBar`

### Fixed

- `limestone/Scroller` and `limestone/VirtualList` to focus the topmost element after scroll in pointer mode

## [2.1.4] - 2022-03-24

### Added

- `limestone/Icon` public class name `icon`
- `limestone/Scroller` and `limestone/VirtualList` prop `data-webos-voice-focused`, `data-webos-voice-disabled`, and `data-webos-voice-group-label`

### Fixed

- `limestone/WizardPanels` to provide a way to prevent focusing on Panel again by allowing preventDefault when `onTransition` and `onWillTransition`

## [2.0.7] - 2022-03-24

### Fixed

- `limestone/WizardPanels` to provide a way to prevent focusing on Panel again by allowing preventDefault when `onTransition` and `onWillTransition`

## [2.1.3] - 2022-03-07

- Updated to use `forwardCustom` and add `type` when forwarding custom events

### Added

- `limestone/Picker` and `limestone/RangePicker` prop `changedBy` to provide a way to control with left and right keys in horizontal joined Picker
- `limestone/VideoPlayer` prop `backButtonAriaLabel`
- `limestone/VideoPlayer` prop `onBack` to provide a way to exit video player via touch

### Changed

- `limestone/Scroller` and `limestone/VirtualList` to show overscroll effect when flicking

### Fixed

- `limestone/Alert` layout for overlay type when screen width is narrow
- `limestone/BodyText` font-size for size `small` and RTL locale
- `limestone/Input.InputField` size 'small' line-height to center text vertically
- `limestone/Input` to show title and keypad properly when `type` is `number` and screen width is narrow
- `limestone/Picker` horizontal joined behavior going to the next item by touch
- `limestone/Scroller` to scroll correctly on Android Chrome 85 or higher in RTL locales
- `limestone/VirtualList` to scroll properly by hover after changing `dataSize` when `hoverToScroll` is `true`

## [2.0.6] - 2022-02-10

### Fixed

- `limestone/VirtualList` to scroll properly by hover after changing `dataSize` when `hoverToScroll` is `true`

## [2.1.2] - 2021-12-22

- Fixed samples build issue

## [2.1.1] - 2021-12-22

### Added

- `limestone/VideoPlayer` props `onWillFastForward`, `onWillJumpBackward`, `onWillJumpForward`, `onWillPause`, `onWillPlay`, and `onWillRewind`

### Fixed

- `limestone/Button` to have centered icon on RTL locale
- `limestone/VideoPlayer` to handle media related callbacks properly
- `limestone/FormCheckboxItem` to show correct color for the focused disabled checkbox

## [2.0.5] - 2021-12-15

### Fixed

- `limestone/Scroller` and `limestone/VirtualList` to focus the topmost element after scroll by voice control in pointer mode

## [2.1.0] - 2021-11-30

- Support color customization

## [2.0.4] - 2021-11-01

### Added

- `limestone/Icon` supported icon list, adding new icons `bluetooth`, `moodmode`, and `changepassword`

### Fixed

- `limestone` to select correct font when font-weight changes in some Indian locales

## [2.0.3] - 2021-10-21

### Fixed

- `limestone` to support India region font correctly
- `limestone/TimePicker` to apply disabled color to the separator

## [2.0.2] - 2021-10-07

### Added

- `limestone/Icon` supported icon list, adding a new icon `spanner`

### Changed

- `limestone/ProgressBar` bar color for `limestone/Alert`

### Fixed

- `limestone/VirtualList` to not move focus to an unexpected item when 5-way directional key hold

## [2.0.1] - 2021-09-28

### Fixed

- `samples/sampler` not to fail in sampler build

## [2.0.0] - 2021-09-28

### Fixed

- `limestone/DatePicker` and `limestone/TimePikcer`abnormal animation
- `limestone/Panels` to perform transition without delay when wheeling

## [2.0.0-rc.9] - 2021-09-13

### Changed

- `limestone/DatePicker` and `limestone/TimePicker` styling to match updated GUI

### Fixed

- `limestone/VirtualList` to not focus the item again if focus moved out of the list via 5way when `snapToCenter`

## [2.0.0-rc.8] - 2021-08-31

### Fixed

- `limestone/Dropdown` to restore focus within the list when moving mouse after clicking dropdown button
- `limestone/Scroller` to move focus via up/down keys from scroll thumb when the content is short but the scrollbar is visible
- `limestone/TimePicker` abnormal minute animation in some locales
- `limestone/WizardPanels` to not read out `undefined` when there is no `subtitle` prop

## [2.0.0-rc.7] - 2021-08-09

### Fixed

- `limestone/Item` to marquee properly when `slotAfter` or `slotBefore` changed

## [2.0.0-rc.6] - 2021-08-03

### Added

- `limestone/Input` type `tel` and `passwordtel`
- `limestone/Slider` prop `noWheel` to disable wheel event handler

### Fixed

- `limestone/ContextualPopupDecorator` to focus elements in `ContextualPopup` when `spotlightRestrict` is `self-first` via 5way
- `limestone/WizardPanels` to prevent re-rendering of previous panel

## [2.0.0-rc.5] - 2021-07-22

### Added

- `limestone/DatePicker` and `limestone/TimePicker` prop `noLabel` to hide label
- `limestone/ImageItem` public classname `imageIcon`
- `limestone/Slider` prop `wheelInterval` to throttle the wheel input

### Fixed

- `limestone/FixedPopupPanels` and `limestone/PopupTabLayout` to not go back to the previous panel by left key on popup opened inside
- `limestone/MediaPlayer` to work trick play via key
- `limestone/Scroller` and `limestone/VirtualList` to show scroll animation properly with 5-way directional keys
- `limestone/Scroller` to not focus the body at the initial rendering when `focusableScrollbar` prop is `byEnter`

## [2.0.0-rc.4] - 2021-07-08

### Fixed

- `limestone/WizardPanels` to revert 2.0.0-rc.3 fix that prevent re-rendering

## [2.0.0-rc.3] - 2021-07-02

### Added

- `limestone/Input` prop `inputFieldSpotlightId` to set `spotlightId` of `InputField`
- `limestone/Input` prop `noSubmitButton` to omit submit button of number key pad

### Changed

- `limestone/Slider` to expand hover area

### Fixed

- `limestone/Picker` value to not marquee when changing `title`
- `limestone/Popup` to have proper focus when opening with `noAnimation` is `true`
- `limestone/Scroller` and `limestone/VirtualList` to scroll by hover when scrollbar is hidden
- `limestone/Scroller` and `limestone/VirtualList` to focus elements at scroll boundaries when `hoverToScroll` is `true`
- `limestone/VideoPlayer` to handle decimal playback rate
- `limestone/VirtualList` to scroll properly when `snapToCenter`
- `limestone/WizardPanels` to prevent re-rendering of previous panel

## [2.0.0-rc.2] - 2021-07-01

### Fixed

- `limestone/Popup` to revert 2.0.0-rc.1 fix that having proper focus when `noAnimation`

## [2.0.0-rc.1] - 2021-06-18

### Added

- `limestone/Picker` props `reverse` and `type` to support for number list
- `limestone/Picker` and `limestone/RangePicker` public class names `title` and `inlineTitle`
- `limestone/Scroller` and `limestone/VirtualList` prop `hoverToScroll` to scroll by hover
- `limestone/VirtualList` prop `snapToCenter`

### Changed

- Shadow effect to using box-shadow instead of drop-shadow for performance on embedded environment
- `limestone/FixedPopupPanels` and `limestone/PopupTabLayout` to disable left key handler to go to the previous panel in RTL locales
- `limestone/MediaPlayer.MediaControls` to show more components when a user flicks on action guide
- `limestone/Scroller` and `limestone/VirtualList` overscroll effect style to match latest designs
- `limestone/Slider` to interact by wheel

### Fixed

- `limestone/FixedPopupPanels` to keep focus inside of popup when pressing 5-way after click
- `limestone/InputField` cursor not to jump unexpectedly when mouse down
- `limestone/MediaPlayer` to show `MediaControls` via wheel properly when isomorphic build
- `limestone/Panels.Header` to not overlap subtitle and children when header type is `mini`
- `limestone/Popup` to have proper focus when opening with `noAnimation` is `true`
- `limestone/PopupTabLayout` to move focus via 5-way left in the header
- `limestone/Scroller` to scroll correctly on Chrome 85 or higher in RTL locales via 5way

## [1.4.9] - 2021-05-26

### Added

- `limestone/Input` type `tel` and `passwordtel`

## [2.0.0-beta.1] - 2021-05-21

- Enhanced touch support

### Added

- `limestone/FixedPopupPanels` and `limestone/PopupTabLayout` left key handler to go to the previous panel
- `limestone/Input` a back button and props `backButtonAriaLabel` and `noBackButton`
- `limestone/Input` and `limestone/Input.InputPopup` `url` to prop `type`
- `limestone/Picker` and `limestone/RangePicker` props `title` and `inlineTitle`
- `limestone/Slider` prop `keyFrequency` to control the accelerating speed when key hold

### Changed

- `limestone/Panels.Header` to always show back button
- `limestone/PopupTabLayout` back key behavior to match the latest UX
- `limestone/PopupTabLayout` to collapse its tab only when a user enters a menu
- `limestone/Scroller` focus rule to match latest UX when `focusableScrollbar` prop is `byEnter`
- `limestone/Scroller` and `limestone/VirtualList` to hide the scrollbar after N seconds
- `limestone/WizardPanels.Panel` `nextButton` and `prevButton` to show labels separately to match latest designs

### Fixed

- `limestone/FormCheckboxItem` to show correct color for `slotBefore` icon in disabled state when focused
- `limestone/ImageItem` to resize the image properly
- `limestone/Input` button label when default value is `0`
- `limestone/Panels.Header` to remeasure marquee metrics when the size of slots changed
- `limestone/Scroller` and `limestone/VirtualList` to activate voice control intent when only scrollable
- `limestone/Scroller` and `limestone/VirtualList` to move focus properly via page key
- `limestone/VideoPlayer` to show the knob when mediaSlider gets focused with 5-way
- horizontal `limestone/VirtualList` to align items well when navigating with 5-way
- `limestone/WizardPanels` to not show focus effect on the wrong element in `footer`

## [1.4.8] - 2021-05-06

### Fixed

- `limestone/Panels.Header` to remeasure marquee metrics when the size of slots changed

## [2.0.0-alpha.3] - 2021-03-31

### Added

- `limestone/Dropdown` number type `width` prop
- `limestone/Item` public class names `itemContent`, `content`, and `label`
- `limestone/Scroller` prop `scrollbarTrackCss` to customize scroll track and thumb style

### Fixed

- `limestone/Dropdown` to not show console error after selecting item
- `limestone/RangePicker` to update label when value is out of range
- `limestone/VirtualList` to not block key down events after panel transition

## [2.0.0-alpha.2] - 2021-03-26

- Update Enact dependency

## [1.4.7] - 2021-03-03

### Added

- `limestone/Item` public class names `itemContent`, `content`, and `label`
- `limestone/Scroller` prop `scrollbarTrackCss` to customize scroll track and thumb style

## [2.0.0-alpha.1] - 2021-02-24

- The framework was updated to support React 17.0.1

### Added

- `limestone/ThemeDecorator` config `rootId` to specify React DOM tree root for global event handlers

## [1.5.0] - 2021-02-09

### Added

- `limestone/Item` prop `data-webos-voice-labels` when `label` is used

### Fixed

- `limestone/Alert` to read out properly after closing it in a `limestone/PopupTabLayout`
- `limestone/FlexiblePopupPanels` padding in RTL locales
- `limestone/Heading` `font-style` to use oblique font instead of fake `italic`
- `limestone/Input` to not have initial focus with pointer when `type` prop is `'number'` or `'passwordnumber'`
- `limestone/Panel` to not reset scroll position by events from others
- `limestone/Panels.Header` to not show back button in the first panel
- `limestone/VideoPlayer.Video` to not start a new play before another one completes

## [1.4.6] - 2021-01-29

### Fixed

- `limestone/ContextualPopupDecorator` to update `ContextualPopup` position properly in RTL locales

## [1.4.5] - 2021-01-05

### Fixed

- `limestone/Dropdown` title `font-style` to `normal` where a locale's fonts cannot support italic

## [1.4.4] - 2020-11-06

### Fixed

- `limestone/ThemeDecorator` font style in non-latin locales
- `limestone/TimePicker` to change its value with up/down key when the focus changed by enter key

## [1.4.3] - 2020-10-30

### Changed

- `limestone/Scroller` and `limestone/VirtualList` scrollbar to always show

### Fixed

- `limestone/Heading` `font-style` to `normal` where a locale's fonts cannot support italic

## [1.4.2] - 2020-10-26

### Fixed

- Cambodian(km) language to be classified as a tall-glyph language
- `limestone/Item` line-height to support tall-glyph language

## [1.4.1] - 2020-10-20

### Fixed

- `limestone/WizardPanels` to read `steps` when neither prop `noSteps` nor `aria-label` is present

## [1.4.0] - 2020-10-16

### Added

- `limestone/TabLayout.Tab` prop `onTabClick` to handle `onClick` event on it

### Fixed

- `limestone/Input` to match latest designs
- `limestone/TooltipDecorator` to marquee when `tooltipReleative` prop is true
- `limestone/VirtualList` to not show overscroll effect when 5-way key is pressed after scrolling to the bottom by wheel
- `limestone/WizardPanels` to read `steps` properly with `noSteps` and `aria-label` props

## [1.3.2] - 2020-09-25

### Changed

- `limestone/WizardPanels` to read out the content of customized `nextButton` and `prevButton`

### Fixed

- `limestone/FlexiblePopupPanels` and `limestone/PopupTabLayout` to match latest designs
- `limestone/Picker` to move focus on increase or decrease button properly via 5-way

## [1.3.1] - 2020-09-17

### Changed

- `limestone/Alert` background color for fullscreen type
- `limestone/Icon` supported icon list, adding a new icon
- `limestone/Icon` and `limestone/Switch` size to not enlarge when large text mode
- `limestone/Scroller` focused body color when `focusableScrollbar` prop is `byEnter`

### Fixed

- `limestone/TabLayout` to not handle key events from other popup components

## [1.3.0] - 2020-09-14

### Added

- `limestone/DatePicker` and `limestone/TimePicker` prop `onComplete` to handle enter key from the last picker

### Changed

- `limestone/RangePicker` to read out properly when Spotlight is on the next or previous button
- `limestone/TooltipDecorator` not to read out audio guidance when showing
- `limestone/WizardPanels` footer to lower position

### Fixed

- `limestone/DatePicker` and `limestone/TimePicker` to focus the next picker with enter key
- `limestone/DatePicker` and `limestone/TimePicker` to show arrows when normal
- `limestone/Scroller` to not restrict focus movement with 5-way directional keys when `focusableScrollbar` prop is `byEnter` and there is no scrollbar

## [1.2.1] - 2020-09-03

### Changed

- Primary background color to black

### Fixed

- `limestone/WizardPanels` to revert 1.2.0 fix that render `Panel` contents within the usual render flow

## [1.2.0] - 2020-09-01

### Added

- `limestone/FlexiblePopupPanels.Panel` `size` property to allow the selection between "auto" sized, "small", and "large" panel presets

### Changed

- `limestone/Scroller` scrollbar thumb to prevent losing focus with 5-way directional keys when `focusableScrollbar` prop is `byEnter`
- `limestone/Scroller` and `limestone/VirtualList` scrollbar color and transparency

### Fixed

- `limestone/FixedPopupPanels`, `limestone/FlexiblePopupPanels` and `limestone/PopupTabLayout` to match latest designs
- `limestone/Input` number pad layout in right-to-left locales for both overlay and fullscreen `Input`
- `limestone/PopupTabLayout` and `limestone/TabLayout` to visibly change focus only once when focusing the tabs via 5-way
- `limestone/TabLayout` to properly change focus when changing `index` programmatically
- `limestone/Tooltip` arrow shape
- `limestone/WizardPanels` to render `Panel` contents within the usual render flow allowing more predictable use of lifecycle methods

## [1.1.4] - 2020-08-24

### Fixed

- `limestone/Dropdown` to match latest designs
- `limestone/Input` number pad layout in right-to-left locales
- `limestone/Item` style to match latest designs
- `limestone/Panels.Header` style to match latest designs
- `limestone/TabLayout` to not lose focus when changing `index` programmatically

## [1.1.3] - 2020-08-17

### Fixed

- `limestone/Button` alignment for small icon-only buttons
- `limestone/Panels` animation after reversing direction
- `limestone/TooltipDecorator` to be positioned correctly over complex components
- `limestone/WizardPanels` to favor other header components when using 5-way within the header
- `limestone/WizardPanels` to focus a spottable component within the first `Panel` on mount
- `limestone/WizardPanel` `noAnimation` autofocus
- Sinhala(si), Thai(th), Vietnamese(vi) languages to be classified as a tall-glyph language, with others like Arabic and Japanese to no longer be classified as tall-glyph. These languages will have new line-height settings, causing their layouts to shift slightly, which should ultimately be closer to the intended designs.

## [1.1.2] - 2020-08-10

### Fixed

- `limestone/Button` style to match latest designs
- `limestone/Panels` to allow key events after being unmounted
- `limestone/Panels.Panel` to return to last focused element when reentering the `Panel`
- `limestone/TabLayout` to correctly restore focus to the selected tab after expanding
- `limestone/VideoPlayer.Video` to reuse video DOM node when changing `source`

## [1.1.1] - 2020-08-05

### Fixed

- `limestone/Button`, `limestone/InputField`, `limestone/Item` and `limestone/Picker` `font-weight`
- `limestone/Button` background color opacity when opaque and disabled
- `limestone/ContextualPopupDecorator` to include the popup in its accessibility tree
- `limestone/FixedPopupPanels` and `limestone/FlexiblePopupPanels` to correctly set focus after closing
- `limestone/Panels` to prevent key events during view transitions
- `limestone/Slider` to read out `value` with the hint string only once when focused

## [1.1.0] - 2020-07-29

### Added

- `limestone/PopupTabLayout` and `limestone/TabLayout` support for animated `Sprite` icons
- `limestone/Scroller` prop `aria-label` to be read out instead of a body text
- `limestone/Sprite` component for animating images
- `limestone/TabLayout.Tab` prop `tabKey` to specify a unique key when the `title` and `icon` combination is not unique
- `limestone/VideoPlayer` prop `onToggleMore` to notify consumers when more components are shown

### Fixed

- `limestone/Checkbox` and `limestone/Switch` to support `aria-disabled`
- `limestone/DayPicker` to not read out current index and total numbers
- `limestone/Dropdown` button margin with title
- `limestone/Dropdown` to delegate voice props to the dropdown button
- `limestone/FixedPopupPanels` and `limestone/FlexiblePopupPanels` to avoid duplicate 5-way navigation when using `limestone/Picker` or `limestone/Input`
- `limestone/FlexiblePopupPanels.Panel` to favor auto-focusing the content over the navigation buttons
- `limestone/ImageItem` to support `aria-disabled`
- `limestone/Input.InputField` to support `aria-disabled`
- `limestone/Item` font-size for large text mode
- `limestone/Item` to support RTL text
- `limestone/MediaPlayer` to pause spotlight during animations
- `limestone/Panels` animation direction for locales that use right-to-left reading order
- `limestone/ProgressButton` icon size
- `limestone/Scroller` and `limestone/VirtualList` scrollbar thumb shape to not clipped
- `limestone/Scroller` not to read out thumb audio guidance when focusing on the body
- `limestone/TabGroup` to read out contents without button `role`
- `limestone/TabLayout` to properly support scrolling the tabs
- `limestone/VideoPlayer` to clear previously read string by calling announce with the `clear` property
- `limestone/VideoPlayer` to read out action guide string after video title
- `limestone/VirtualList` to not lose focus when entering from outside after scrolling via 5-way

## [1.0.1] - 2020-07-20

### Fixed

- `limestone/ImageItem` to re-render properly when `data-index` prop is the same
- `limestone/Scroller` to set its height correctly
- `limestone/Scroller` and `limestone/VirtualList` overscroll style to match latest designs
- `limestone/Scroller` and `limestone/VirtualList` to properly support `spotlightDisabled` prop
- `limestone/VirtualList` to preserve focus in panels

## [1.0.0] - 2020-07-13

### Changed

- `limestone/Icon` supported icon list, adding new icons

### Fixed

- `limestone/ActionGuide` style to match latest designs
- `limestone/Button` to animate when focused and pressed
- `limestone/ContextualMenu` style to match latest designs
- `limestone/DayPicker` to pass `disabled` to each child instead of applying to its container
- `limestone/DropDown` title color
- `limestone/FixedPopupPanels` and `limestone/PopupTabLayout` to change `Panel` height when the contents change
- `limestone/FixedPopupPanels`, `limestone/Panels`, and `limestone/PopupTabLayout` to avoid skipping panel animations when under system load
- `limestone/FlexiblePopupPanels` navigation buttons to not be clipped when focused
- `limestone/ImageItem` to center the label in vertical orientation when `centered` prop is true
- `limestone/Input` text selection color
- `limestone/Input` to close the popup with the enter key only when the VKB is activated
- `limestone/Input` to properly read out number values
- `limestone/MediaPlayer.MediaControls` animation when more components are rendered
- `limestone/MediaPlayer.MediaSlider` style to match latest designs
- `limestone/Panels.Header` spacing between title and subtitle
- `limestone/Popup` to correctly emit the `onClose` event when focus attempts to leave the popup
- `limestone/PopupTabLayout` padding so it's the same distance all the way around the tab buttons
- `limestone/PopupTabLayout` and `limestone/TabLayout` to not lose focus from tabs with 5-way
- `limestone/Scroller` to not lose focus from scrollbar when re-rendered
- `limestone/Slider` to readout `value` when the knob is focused
- `limestone/VirtualList` to not clip the shadow of the last item when `wrap` prop is true or `scrollMode` is translate
- `limestone/WizardPanels` style when using `noSteps`

## [1.0.0-rc.4] - 2020-07-09

### Fixed

- `limestone/TabLayout` layout in RTL locales

## [1.0.0-rc.3] - 2020-07-07

### Fixed

- `limestone/FixedPopupPanels` to use an opaque background in high-contrast mode
- `limestone/MediaControls` margins to correctly align in RTL

## [1.0.0-rc.2] - 2020-07-07

### Removed

- `limestone` support for `data-spotlight-container-muted`

### Added

- `limestone/Input` event `onBeforeChange`

### Changed

- `limestone/PopupTabLayout.TabPanels` prop `noCloseButton` to be `false` by default
- `limestone/TooltipDecorator` prop `tooltipWidth` and `limestone/TooltipDecorator.Tooltip` prop `width` to support either an auto-scaled number of pixels or a string CSS measurement value

### Fixed

- `limestone/Button` style to match latest designs
- `limestone/Button` style when using small, icon-only buttons in non-latin locales
- `limestone/Dropdown` to read out `aria-label` without `title` when `aria-label` prop exists
- `limestone/Dropdown` to reveal its title when scrolling up by 5-way in a scroller
- `limestone/FixedPopupPanels` to use a translucent background
- `limestone/FlexiblePopupPanels` to retain focus on navigation buttons when used to change panels
- `limestone/ImageItem` to pass `role` and `aria-checked` when `showSelection` prop exists
- `limestone/Input` to marquee the invalid tooltip
- `limestone/Panels.Panel` to read out the title and subtitle except when used in `limestone/WizardPanels`
- `limestone/Picker` values position in RTL
- `limestone/Popup` to respect paused spotlight
- `limestone/PopupTabLayout` style to match latest designs
- `limestone/Scroller` to stop the propagation of keydown events from a scroller thumb when it scrolls
- `limestone/Scroller` vertical padding to prevent overlapping contained components
- `limestone/Spinner` style to match latest designs
- `limestone/TabLayout` to disable the collapsed list icon button when all tabs are disabled
- `limestone/TabLayout` and `limestone/PopupTabLayout` transition performance
- `limestone/TimePicker` spacing between pickers in RTL
- `limestone/WizardPanels` to read out properly

## [1.0.0-rc.1] - 2020-06-29

### Removed

- `limestone` focus animation

### Added

- `limestone` high-contrast support

### Changed

- `limestone/Input` prop `size` default value to small

### Fixed

- `limestone/ActionGuide`, `limestone/Alert`, `limestone/Checkbox`, `limestone/CheckboxItem`, and `limestone/FormCheckboxItem`, `limestone/Input`, `limestone/MediaPlayer`, `limestone/Picker`, and `limestone/VideoPlayer` style to match latest designs
- `limestone/Dropdown` margins to correctly align with other components
- `limestone/FixedPopupPanels` and `limestone/FlexiblePopupPanels` to allow clicking near, but outside, the Panels to dismiss them
- `limestone/FixedPopupPanels` to not read out a title twice
- `limestone/FlexiblePopupPanels` and `limestone/PopupTabLayout` shadow effects
- `limestone/Input` submit button positioning
- `limestone/Item` to prevent unnecessary re-rendering
- `limestone/PopupTabLayout` to read out properly
- `limestone/Scroller` and `limestone/VirtualList` to not show a scroll thumb when focus is moving without scrolling
- `limestone/Tooltip` arrow rendering to eliminate a vertical gap
- `limestone/WizardPanels` direction of buttons and transition in RTL locales

## [1.0.0-beta.8] - 2020-06-22

### Added

- `limestone` LESS mixin `.sand-spotlight-focus-text-colors` to support focused font style
- `limestone/ImageItem` prop `centered` to center the primary caption in vertical orientation

### Changed

- `limestone` LESS mixins `.sand-spotlight-resting-colors` and `.sand-spotlight-focus-colors` to `.sand-spotlight-resting-bg-colors` and `.sand-spotlight-focus-bg-colors` respectively
- `limestone/Button` to include a small top and bottom margin to avoid clipping the expanded focus state
- `limestone/Dropdown` to prevent focus on the outer area
- `limestone/Icon` supported icon list
- `limestone/Input` `disabled` prop to not close an open input
- `limestone/MediaControls` to show more components via wheel down

### Fixed

- `limestone/Dropdown` to support readout placeholder string
- `limestone/Button`, `limestone/DatePicker`, `limestone/FormCheckboxItem`, `limestone/ImageItem`, `limestone/Item`, and `limestone/MediaOverlay` font style when focused
- `limestone/Checkbox` to center the icon
- `limestone/ContextualMenuDecorator` to match the latest style guide
- `limestone/DatePicker` to read out 'day', 'month', or 'year' when it is focused or its value is changed
- `limestone/Dropdown` to match the latest design
- `limestone/Dropdown` to not expand the button activator when focused
- `limestone/FixedPopupPanels` and `limestone/FlexiblePopupPanels` to respect `spotlightRestrict`
- `limestone/FixedPopupPanels` padding in RTL locales
- `limestone/FormCheckboxItem` to not have a focusable inner part
- `limestone/Input` to display the submit button when the number input field is used
- `limestone/Input` to support accessibility features
- `limestone/Item` style to match latest designs
- `limestone/KeyGuide` to position on the right in RTL
- `limestone/MediaOverlay` style to match latest designs
- `limestone/Panels` to properly restore focus after a transition
- `limestone/Popup` to correctly emit the `onClose` event when focus leaves the popup
- `limestone/PopupTabLayout` to position on the left in RTL
- `limestone/ProgressButton` to match the latest design
- `limestone/Scroller` and `limestone/VirtualList` to not show the scrollbar on every re-render
- `limestone/Switch` and `limestone/SwitchItem` accessibility read out
- `limestone/TabLayout` to center tab icons when collapsed
- `limestone/TimePicker` to read out 'hour' or 'minute' when it is focused or its value is changed
- `limestone/TooltipDecorator` to center text when `tooltipMarquee` is used with centered alignment

## [1.0.0-beta.7] - 2020-06-16

### Added

- `limestone/Dropdown` prop `title` to optionally display a heading above the component
- `limestone/FixedPopupPanels` and `limestone/FlexiblePopupPanels` prop `fullHeight` to force these components to always stretch to the screen edges
- `limestone/Icon` prop `flip` value `"auto"` to automatically flip the icon horizontally for RTL locales
- `limestone/TooltipDecorator` prop `tooltipType` to support new transparent label-style tooltips
- `limestone/TooltipDecorator` prop `tooltipMarquee` to support marquee

### Changed

- `limestone/Dropdown` prop `title` to `placeholder` to display a value within the component when no selection has been made
- `limestone/Input` to highlight activated number cells
- `limestone/Panel` and `limestone/WizardPanels` support for reference forwarding to obtain a reference to each component's root node

### Fixed

- `limestone/Alert` to center its content when `type="fullscreen"`
- `limestone/Button` flashing when switching `selected` on and off
- `limestone/CheckboxItem`, `limestone/FormCheckboxItem`, `limestone/RadioItem`, and `limestone/SwitchItem` slots margins
- `limestone/ContextualMenuDecorator` to not be read as an alert when rendered
- `limestone/ContextualPopupDecorator` to position itself correctly when `direction` is changed
- `limestone/DayPicker` format for locales that do not start the week on Sunday
- `limestone/Dropdown` to properly read the focused item
- `limestone/FixedPopupPanels` layout in RTL locales
- `limestone/FixedPopupPanels` to support accessibility properly
- `limestone/FixedPopupPanels` to flex to the content size and invoke scrolling (when using `limestone/Scroller`) when the content is too big
- `limestone/Input` to update `invalidTooltip` to the latest design
- `limestone/Panel` and `limestone/WizardPanels` to not read out the Panel title after closing a dropdown
- `limestone/TabLayout` to restore focus to the selected tab when expanding without icons
- `limestone/TabLayout` performance when focusing items in the layout
- `limestone/ThemeDecorator.AccessibilityDecorator` not to overwrite its `skinVariants` prop
- `limestone/VirtualList` focus when 5-way directional keys are quickly and consecutively pressed
- `limestone/WizardPanels` to use `limestone/Skinnable`

## [1.0.0-beta.6] - 2020-06-08

### Removed

- `limestone/Alert` prop `subtitle`

### Added

- `limestone/KeyGuide` support for color keys
- `limestone/Scroller` props `horizontalScrollThumbAriaLabel` and `verticalScrollThumbAriaLabel` to provide customization of the hint string read when a scroll thumb is focused

### Changed

- `limestone/Icon` supported icon list, adding new icons and removing unused ones

### Fixed

- `limestone/Alert` to use multi-line content when `"fullscreen"`
- `limestone/Checkbox`, `limestone/CheckboxItem`, `limestone/Switch`, `limestone/SwitchItem`, `limestone/RadioItem` and `limestone/FormCheckboxItem` to read out as selected value
- `limestone/Dropdown` to retain correct focus when `selected` or `children` change
- `limestone/Dropdown` to show an item fully when the item gets focus
- `limestone/FixedPopupPanels` and `limestone/FlexiblePopupPanels` to properly respond to back button presses
- `limestone/Panels.Header` style to match latest designs
- `limestone/Popup` to always remove the scrim when closed
- `limestone/Scroller` and `limestone/VirtualList` to show the scrollbar initially
- `limestone/Scroller` and `limestone/VirtualList` to show the horizontal overscroll effect properly in RTL locales
- `limestone/TabLayout` button sizes to match the latest designs
- `limestone/WizardPanels` to respect using `spotlight/SpotlightContainerDecorator.spotlightDefaultClass` to determine the default focus

## [1.0.0-beta.5] - 2020-06-01

### Removed

- `limestone/MediaPlayer.MediaControls` props `backwardIcon`, `forwardIcon`, `noRateButtons`, `onBackwardButtonClick`, `onForwardButtonClick`, `rateButtonsDisabled`

### Added

- `limestone/FlexiblePopupPanels.Panel` props `prevButton` and `nextButton` to provide customization of the navigational buttons on each `Panel`
- `limestone/FlexiblePopupPanels` props `onChange`, `onNextClick`, and `onPrevClick` to notify consumers of navigational events
- `limestone/FlexiblePopupPanels` props `prevButtonVisibility` and `nextButtonVisibility` for assigning the default visibility of the navigational buttons
- `limestone/MediaPlayer.MediaControls` prop `rateChangeDisabled` to prevent playback rate control via rewind and fast-forward keys
- `limestone/PopupTabLayout` panel transition animation

### Changed

- `limestone/FlexiblePopupPanels` to provide a close button on the first panel and navigational buttons on each panel

### Fixed

- `limestone/Alert` to support the use of any component in the children area
- `limestone/DatePicker` and `limestone/TimePicker` to handle locale changes
- `limestone/DatePicker` and `limestone/TimePicker` to format locale labels on-demand for v8 snapshot compatibility
- `limestone/Dropdown` to center scrolling to selected index
- `limestone/Item` to properly accept numbers for `label`
- `limestone/PopupTabLayout` tall-content scrolling capability
- `limestone/PopupTabLayout` and `limestone/FixedPopupPanels` bottom padding
- `limestone/Scroller` and `limestone/VirtualList` scrollbar height
- `limestone/Slider` bar style to match latest designs
- `limestone/VideoPlayer` to show a scrim behind the media controls
- `limestone/VirtualList` to properly set the scroll position after focus changes

## [1.0.0-beta.4] - 2020-05-26

### Removed

- `limestone/Panels` prop `featureContent`
- `limestone/Panels.FixedPopupPanels`, `limestone/Panels.FlexiblePopupPanels`, `limestone/Panels.View`, and `limestone/Panels.WizardPanels` aliases
- `limestone/Scroller` and `limestone/VirtualList` prop `initialHiddenHeight`
- `limestone/WizardPanels` prop `buttons`, put buttons inside `footer` instead
- `limestone/WizardPanels` props `noPrevButton`,`noNextButton`, `nextButtonAriaLabel`, `nextButtonText`, `prevButtonAriaLabel`, and `prevButtonText`, replacing them with simpler `nextButton` and `prevButton` props

### Added

- `limestone/DatePicker` function `dateToLocaleString` to create locale-aware date strings
- `limestone/DayPicker` component
- `limestone/Icon` feature to support arbitrary icon sizes via the existing `size` prop
- `limestone/ImageItem` public class names `fullImage`, `horizontal`, and `vertical`
- `limestone/Input` props `invalid` and `invalidMessage` to mirror the API of `InputField`
- `limestone/Input` props `maxLength`, `minLength`, and `numberInputField` to support arbitrary number lengths
- `limestone/PopupTabLayout` and `limestone/TabLayout` prop `onTabAnimationEnd` to notify consumers when the animation to collapse or expand the tabs completes
- `limestone/TimePicker` function `timeToLocaleString` to create locale-aware time strings
- `limestone/WizardPanels` props `prevButtonVisibility` and `nextButtonVisibility` for assigning the default visibility of the navigational buttons
- `limestone/WizardPanels.Panel` props `prevButton` and `nextButton` to provide customization of the navigational buttons on each `Panel`

### Fixed

- `limestone/Panels` to not fire transition events when initially rendered
- `limestone/Scroller` and `limestone/VirtualList` to properly handle keydown events
- `limestone/TabLayout` default focus rules
- `limestone/Tooltip` style to match latest designs
- `limestone/VideoPlayer` to jump back when using the 5-way left key
- `limestone/VirtualList` to support navigation with spottable children inside an item

## [1.0.0-beta.3] - 2020-05-11

### Removed

- `limestone/VideoPlayer.MediaControls` component. Use `limestone/MediaPlayer.MediaControls` instead.

### Added

- `limestone/FixedPopupPanels` `width` prop, which now includes "half" to support larger content
- `limestone/MediaPlayer` submodule which provides `MediaControls`, `MediaSlider`, and `Times` components for use in custom media player components
- `limestone/TabLayout` support for `horizontal` orientation
- `limestone/WizardPanels` props `current` and `total` to configure the `Steps` component directly when the number of `Panel` instances do not match the number of steps
- `limestone/WizardPanels` prop `onBack` to allow developers to handle back button presses
- `limestone/WizardPanels` support for animating changes to title and subtitle

### Changed

- `limestone/Scroller` and `limestone/VirtualList` to adjust padding area
- `limestone/Scroller` and `limestone/VirtualList` clickable scrollbar area
- `limestone/WizardPanels` to automatically handle back key when `noPrevButton` is not set
- `limestone/WizardPanels` to support multi-line subtitles

### Fixed

- `limestone/Panels.Header` to match latest designs

## [1.0.0-beta.2] - 2020-05-04

### Deprecated

- `limestone/Panels.WizardPanel` and `limestone/Panels.View`, replaced with `limestone/WizardPanels` and `limestone/WizardPanels.Panel` respectively
- `limestone/Panels.FlexiblePopupPanels`, replaced with `limestone/FlexiblePopupPanels`
- `limestone/Panels.FixedPopupPanels`, replaced with `limestone/FixedPopupPanels`

### Added

- `limestone/WizardPanels` props `nextButtonAriaLabel`, `prevButtonAriaLabel`, `noNextButton`, `noPrevButton`, and `noSteps`
- `limestone/Scroller` and `limestone/VirtualList` prop `initialHiddenHeight` to provide the height of the vertical scrollbar when the `featureContent` prop in the panel is set to true
- `limestone/Input.InputPopup` component

### Fixed

- `limestone/Header` centering
- `limestone/Input.InputField` disabled colors
- `limestone/WizardPanels` to hide previous and next buttons appropriately
- `limestone/TabLayout` to support disabled tabs

## [1.0.0-beta.1] - 2020-04-27

### Removed

- `limestone/Item` prop `selected`
- `limestone/Panels.Header` props `headerInput` and `showInput`
- `limestone/TabLayout` prop `tabs`
- `limestone/DayPicker`, `limestone/DaySelector`, `limestone/Dialog`, `limestone/EditableIntegerPicker`, `limestone/ExpandableInput`, `limestone/ExpandableItem`, `limestone/ExpandableList`, `limestone/ExpandablePicker`, `limestone/FormCheckbox`, `limestone/GridListImageItem`, `limestone/IconButton`, `limestone/IncrementSlider`, `limestone/InputPopup`, `limestone/LabeledIcon`, `limestone/LabeledIconButton`, `limestone/LabeledItem`, `limestone/Notification`, `limestone/Panels.ActivityPanels`, `limestone/Panels.AlwaysViewingPanels`, `limestone/Panels.Breadcrumb`, `limestone/SelectableItem`, `limestone/SlotItem`, `limestone/ToggleButton`, `limestone/ToggleIcon`, and `limestone/ToggleItem`

### Added

- `limestone/Heading` support for `size` type of `'tiny'`
- `limestone/Item` prop `centered`
- `limestone/Panels` and `limestone/Panels.WizardPanel` props `onTransition` and `onWillTransition`
- `limestone/Panels.WizardPanel` prop `noAnimation` to suppress view transition animation
- `limestone/PopupTabLayout` component
- `limestone/Scroller` prop `fadeOut` to show fade-out effect
- `limestone/Slider` and `limestone/ProgressBar` prop `showAnchor` to display anchor based on `progressAnchor` value
- `limestone/VideoPlayer` props `initialJumpDelay`, `jumpDelay`, and `no5WayJump` to prevent and adjust the speed of media jumping via 5-way
- `limestone/VirtualList.VirtualGridList` prop `noAffordance` to remove the affordance effect when scrolling forward via 5-way

### Changed

- `limestone/ImageItem` focus effect when in a vertical orientation

### Fixed

- `limestone/BodyText` font weight
- `limestone/BodyText` line-wrap and `noWrap` capabilities
- `limestone/DatePicker` and `limestone/TimePicker` to match current designs
- `limestone/Dropdown` to focus on selected option
- `limestone/Picker` horizontal joined height in large text mode
- `limestone/Scroller` focus behavior of the scroll thumb

## [1.0.0-alpha.9] - 2020-04-20

### Deprecated

- `limestone/TabLayout` prop `tabs`, to be removed in beta.1. Use `limestone/TabLayout.Tab` instead.

### Added

- `limestone/Panels.Panel` prop `featureContent` to minimize the panel visuals to feature the content more prominently
- `limestone/TabLayout.Tab` for configuring `TabLayout` tab contents

### Fixed

- `limestone/Button` styles for `selected`
- `limestone/Switch` sizing and positioning in large text mode
- `limestone/Checkbox` and `limestone/RadioItem` styling when disabled and focused

## [1.0.0-alpha.8] - 2020-04-14

### Deprecated

- `limestone/Panels.Header` props `headerInput` and `showInput`, to be removed in 1.0.0-beta.1

### Added

- `limestone/Panels.FlexiblePopupPanels` for a flexible size pop-up Panels experience
- `limestone/Panels` and `limestone/Panels.Header` props `backButtonAriaLabel`, `backButtonBackgroundOpacity`, `closeButtonAriaLabel`, `closeButtonBackgroundOpacity`, `noBackButton`, `noCloseButton`, `onBack`, and `onClose`

### Changed

- `limestone/Panels.OptionPanels` to `limestone/Panels.FixedPopupPanels`
- `limestone/Scroller` and `limestone/VirtualList` overscroll effect to bounce
- `limestone/Picker` horizontal joined behavior and style for updated GUI

### Fixed

- `limestone/TabLayout` to not select a previously focused tab after switching from 5-way to pointer mode

## [1.0.0-alpha.7] - 2020-04-06

### Added

- `limestone/Tooltip` public class names `tooltip` and `tooltipLabel`

### Changed

- `limestone/Picker`, `limestone/ProgressBar.ProgressBarTooltip`, and `limestone/Steps` to use a number font for numeric content

### Fixed

- `limestone/Panels.Header` to always vertically center the input field
- `limestone/ImageItem` to not have a truncated label in RTL locales
- `limestone/VirtualList.VirtualGridList` to position items correctly at the bottom when scrolling via down key
- `limestone/Switch` styling when disabled and focused

## [1.0.0-alpha.6] - 2020-03-30

### Removed

- `limestone/Panels` support for `controls` and the application close button

### Deprecated

- `limestone/FormCheckbox`, use `limestone/Checkbox` instead
- `limestone/GridListImageItem`, use `limestone/ImageItem` instead
- `limestone/Panels.Breadcrumb`, to be removed in beta.1

### Added

- `limestone/ImageItem` component
- `limestone/ProgressButton` component
- `limestone/Checkbox` standalone interactive capability
- `limestone/Checkbox`, `limestone/CheckboxItem`, and `limestone/FormCheckboxItem` props `indeterminate` and `indeterminateIcon`, for representing a half or mixed state of a checkbox
- `limestone/FromCheckboxItem` and `limestone/Item` styling

### Changed

- `limestone/FeedbackTooltip` visuals for updated GUI
- `limestone/MediaOverlay` styling
- `limestone/Panels` to default to `SlideLeftArranger`
- `limestone/Panels` styling to match updated GUI

### Fixed

- `limestone/Button` and `limestone/Item` (and their derivatives) disabled colors
- `limestone/Button` icon-only sizing so it is square once again
- `limestone/Input` overlay number type keypad to lay-out its buttons correctly, in a 3x4 grid
- `limestone/Scroller` and `limestone/VirtualList` to scroll by wheel on the scrollbar
- `limestone/Scroller` and `limestone/VirtualList` to hide the scrollbar after N seconds
- `limestone/Slider` default behavior to activate by focus, so the slider is immediately interactive when using 5-way
- `limestone/ProgressBar.ProgressBarTooltip` to display only "center" position when "auto" is selected

## [1.0.0-alpha.5] - 2020-03-23

### Removed

- `limestone` LESS mixins `.sand-spotlight-resting` and `.sand-spotlight-focus`, replacing them with `.sand-spotlight-resting-color` and `.sand-spotlight-focus-color` respectively

### Changed

- `limestone/VideoPlayer` to not hide playback controls when pressing 5-way up

### Fixed

- `limestone/Input.InputField` to show icons when focused
- `limestone/Scroller`, `limestone/VirtualList.VirtualGridList`, and `limestone/VirtualList` to position overscroll effect properly when a horizontal scrollbar is displayed
- `limestone/Scroller` to show the focused item fully when scrolling with 5-way directional keys
- `limestone/TabLayout` to select tabs when focusing them in 5-way mode
- `limestone/ThemeDecorator` global focus+disabled rules to not double-apply opacity values

## [1.0.0-alpha.4] - 2020-03-17

### Added

- `limestone/GridListImageItem` props `imageIconComponent` and `imageIconSource` to support an image icon
- `limestone/Input` prop `size`
- `limestone/Switch` support for focus state

### Fixed

- `limestone/Button` icon sizing
- `limestone/ContextualPopupDecorator` to correctly manage focus when changing its open state
- `limestone/Input` and `limestone/Popup` to correctly support marquee
- `limestone/Picker` joined styling
- `limestone/Scroller.Scroller` to display the `scrollbar` as the correct height
- `limestone/Scroller.Scroller` to scroll not sluggish when holding keys on scroll thumb
- `limestone/SwitchItem` styling
- `limestone/VideoPlayer` to continue to display controls when user activity is detected˛

## [1.0.0-alpha.3] - 2020-03-09

### Deprecated

- `limestone/Panels.ActivityPanels` and `limestone/Panels.AlwaysViewingPanels`, use `limestone/Panels.Panels` or one of the pre-defined views.
- `limestone/DayPicker`, `limestone/DaySelector`, `limestone/EditableIntegerPicker`, `limestone/ExpandableItem`, `limestone/ExpandablePicker`, `limestone/ToggleButton`, `limestone/ToggleIcon` to be removed in beta.1
- `limestone/Dialog`, use `limestone/Popup`
- `limestone/ExpandableInput`, `limestone/InputPopup`, `limestone/InputPopup.NumberInputPopup`, use `limestone/Input`
- `limestone/LabeledItem`, `limestone/SlotItem`, `limestone/ToggleItem`, use `limestone/Item`
- `limestone/Notification`, use `limestone/Alert`
- `limestone/SelectableItem`, use `limestone/CheckboxItem`

### Changed

- `limestone/Input` to implement a popup-style input. The old functionality was moved to `limestone/Input.InputField`, but is reserved and should only be used when expressly permitted.

### Fixed

- `limestone/VirtualList.VirtualList` and `limestone/VirtualList.VirtualGridList` to not suddenly jump when pressing directional keys after wheeling
- `limestone/Scroller.Scroller` to wheel normally when `focusableScrollbar` prop is `byEnter`
- `limestone/Button` styling
- `limestone/Heading` styling

## [1.0.0-alpha.2] - 2020-03-03

### Changed

- `limestone/Alert` visuals for updated GUI
- `limestone/VideoPlayer` visuals for updated GUI

### Added

- `limestone/InputPopup` component
- `limestone/Panels.WizardPanel` component

## [1.0.0-alpha.1] - 2020-02-26

Initial alpha release.
