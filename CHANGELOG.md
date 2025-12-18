# Change Log

The following is a curated list of changes in the Enact limestone module, newest changes on the top.

## [unreleased]

### Changed

- `limestone/VirtualList` warning condition so the message will be shown only when `itemSizes.minSize` and `cbScrollTo` are set

## [1.7.0] - 2025-12-08

### Added

- `limestone/Icon` supported icon list, adding new icons `link2` and `btspeakermute`
- `limestone/Card` `aria-label` prop to allow user to custom the aria-label
- `limestone/Card` `icon` prop to allow user to change the icon
- `limestone/Card` added option for progressBar
- `limestone/Card` `splitCaption` prop to allow user to split the content for the captions
- `limestone/Card` `withoutMarquee` prop to allow user to remove the text marquee effect
- `limestone/Chip` `checked` prop to allow user to mark `Chip` component as `checked`
- `limestone/Chip` `isImage` and `imageSize` props to allow user to use `Image` instead of `Icon`
- `limestone/PageViews` `bannerMode` prop to allow 5-way navigation between pages
- `limestone/ThemeDecorator/screenTypes` value `wuhd` to support WUHD displays

### Changed

- `limestone/Card` to match the latest GUI
- `limestone/Checkbox` to match the latest GUI
- `limestone/ImageItem` to match the latest GUI
- `limestone/RadioItem` to match the latest GUI
- `limestone/TabLayout` styling to match the latest GUI
- `limestone/useScroll.HoverToScroll` scroll animation speed
- `limestone/VideoPlayer.FeedbackTooltip` to match the latest GUI

### Fixed

- `limetone/Card` voice control to select the Card
- `limestone/ContextualPopupDecorator` to be positioned appropriately on dynamic resolution changes
- `limestone/Panels.Header` to use correct positions for elements inside slotBefore and slotAfter
- `limestone/VideoPlayer.FeedbackTooltip` to use correct font family

## [1.6.2] - 2025-11-05

### Fixed

- `limestone/Panels.Header` to use same Header height with/without subtitle.

## [1.6.1] - 2025-10-29

### Added

- `limestone/Card` audio guidance for disabled
- `limestone/Icon` supported icon list, updating existing icons

### Fixed

- `limestone/ImageItem` to get custom `aria-label`
- `limestone/Input` `fullscreen` to prevent the title in portrait mode from rendering over the close button
- `limestone/Input` `overlay` to prevent the invalid tooltip from overflowing
- `limestone/Panels.Header` to stop layout shifting on render
- `limestone/Panels.Header` to stop layout shifting when `noCloseButton` is active
- `limestone/TabLayout` automatic expand/collapse behavior on screen orientation changes
- `limestone/VideoPlayer` feedback style

## [1.6.0] - 2025-10-14

### Added

- `limestone/Dropdown` aria props for audio guidance
- `limestone/Scroller` `scrollToContentContainerOnFocus` prop to scrolls to the content container when descendants get focused
- `limestone/TabLayout` `blockExpandOnLandscape` prop to prevent the tab list from automatically expand when the screen orientation changes to landscape mode

### Changed

- `limestone/Panels` to match the latest GUI
- `limestone/PopupTabLayout` to match the latest GUI
- `limestone/TabLayout` vertical to be expanded in landscape mode
- `limestone/VideoPlayer` to match the latest GUI

### Fixed

- `limestone/ContextualPopupDecorator` to focus content with timeout when popup opens
- `limestone/Dropdown` audio guidance for DropdownList
- `limestone/Panels.Header` to stop layout shifting when `slotAfter` or `slotBefore` are modified
- `limestone/Scroller` with `editable` prop to have proper `aria-label` when item is selected
- `limestone/TabLayout` to correctly scroll on tab change, when it is wrapped in `ContentContainerDecorator`

## [1.5.0] - 2025-09-24

### Added

- `limestone/Card` `fitImage` prop to allow image to fit the container by height and be centered

### Fixed

- `limestone/FlexiblePopupPanels` to match the latest GUI
- `limestone/Panels.Header` to match the latest GUI
- `limestone/VideoPlayer` position of feedback content
- `limestone/VirtualList.VirtualGridList` not to show overscroll effect when press down key

## [1.4.0] - 2025-09-15

### Added

- `limestone/CheckboxItem` `CheckboxItemGroup` to wrap multiple checkbox items as a list
- `limestone/Item` props `slotAfterAria` and `slotBeforeAria` for audio guidance of slotAfter and slotBefore
- `limestone/RadioItem` `RadioItemGroup` to wrap multiple radio items as a list
- `limestone/VirtualList` prop `continue5WayHold` to scroll continuously from in a VirtualList to the outer scroller.

### Changed

- `limestone/Chip` audio guidance for chip button and delete button
- `limestone/ImageItem` audio guidance for selected

### Fixed

- `limestone/Alert` buttons styles for overlay `type`.
- `limestone/Card` to block select on `keyDown` instead of `keyUp` when `disabled`
- `limestone/ContextualPopupDecorator` to focus content with timeout when popup opens
- `limestone/DatePicker` to match the latest GUI
- `limestone/Dropdown` by removing unnecessary aria props
- `limestone/Input` buttons styles for number `popupType`.
- `limestone/InputField` to not clip icons in webOS system.
- `limestone/MediaPlayer.MediaControls` enforced direction of buttons as `ltr` to prevent them from swapping in RTL locales
- `limestone/Panels.Header` to match the latest GUI
- `limestone/TimePicker` to match the latest GUI
- `limestone/VideoPlayer` to read out the timestamp properly

## [1.3.2] - 2025-09-02

### Fixed

- `limestone/Alert` to show the outline appropriately in high-contrast mode
- `limestone/Button` icon color to support style override
- `limestone/Card` audio guidance to translate
- `limestone/Card` `background` and `border` for `focusRing` mode
- `limestone/KeyGuide` to show the outline appropriately in high-contrast mode
- `limestone/Scroller` with `editable` prop to remain focused on the selected item when completing edit by down or enter key in pointer mode
- `limestone/PopupTabLayout` to show the background color appropriately in high-contrast mode

## [1.3.1] - 2025-08-14

### Changed

- Global variable from `ILIB_SANDSTONE_PATH` to `ILIB_LIMESTONE_PATH`

## [1.3.0] - 2025-08-08

### Added

- `limestone/Card` prop `imageSize` to set the size of card image
- `limestone/Icon` supported icon list, adding new icons
- `limestone/Input` prop `buttons`
- `limestone/MediaPlayer.Times` prop `includeHour` to conditionally show hour for current and total time
- `limestone/VideoPlayer` prop `includeTimeHour` to conditionally show hour for current and total time

### Changed

- All components in `light` skin and high-contrast mode styling to match the latest GUI
- `limestone/Card` to display `captions` on focus
- `limestone/CheckboxItem` styling to match the latest GUI
- `limestone/FlexiblePopupPanels` styling to match the latest GUI
- `limestone/FormCheckboxItem` styling to match the latest GUI
- `limestone/MediaOverlay` styling to match the latest GUI
- `limestone/RadioItem` styling to match the latest GUI
- `limestone/TabLayout` vertical to be collapsed in portrait mode
- `limestone/Tooltip` styling to match the latest GUI

### Fixed

- `limestone/Card` for `focusRing` mode
- `limestone/Card` `background` for captions
- `limestone/Icon` medium size
- `limestone/Popup` to restore focus properly when popup hides
- `limestone/QuickGuidePanels` navigation buttons position
- `limestone/Scroller` to prevent the native scrolling behavior caused by keydown events only when a popup is open
- `limestone/Scroller` to restore focus when focus is lost after scroll by voice control
- `limestone/Scroller` with `editable` prop to work properly with deployed apps
- `limestone/Scroller` with `editable` prop to recognize button if clickEvent is triggered for `Button` background 
- `limestone/TabLayout` to maintain the same scroller position when `Tabs` are collapsed or expanded
- `limestone/VideoPlayer` size of the icons from the control buttons

## [1.2.0] - 2025-07-11

### Added

- `limestone/Chip` prop `id` to manage focus properly

### Changed

- `limestone/ActionGuide` styling to match the latest GUI
- `limestone/IconItem` styling to match the latest GUI
- `limestone/ImageItem` styling to match the latest GUI
- `limestone/KeyGuide` styling to match the latest GUI
- `limestone/Slider` styling to match the latest GUI
- `limestone/Spinner` styling to match the latest GUI
- `limestone/TimePicker` styling to match the latest GUI
- `limestone/VideoPlayer` styling to match the latest GUI

### Fixed

- `limestone/Chips` to handle focus properly when `children` changes
- `limestone/FixedPopupPanels` to work with `noAnimation`
- `limestone/FlexiblePopupPanels` to work with `noAnimation`
- `limestone/InputPopup` prop `defaultValue` to be displayed when it's set
- `limestone/TooltipDecorator` to change position if wrapped component changes size
- `limestone/WizardPanels` title visibility when `prevButton` or `nextButton` are set to `false`

## [1.1.0] - 2025-06-25

### Added

- `limestone/ContextualPopup` `large` type `offset`
- `limestone/Icon` supported icon list, adding new icons
- `limestone/ImageItem` prop `wideImage` to support wide image

### Changed

- `limestone/Alert` styling to match the latest GUI
- `limestone/Button` styling to match the latest GUI
- `limestone/Button` font-size for non-latin locale
- `limestone/Dropdown` styling to match the latest GUI
- `limestone/ImageItem` styling to match the latest GUI
- `limestone/Input` styling to match the latest GUI
- `limestone/PageViews` indicator styling to match the latest GUI

### Fixed

- `limestone/Button` min-width for `iconOnly` button in large text mode
- `limestone/ImageItem` props `children` and `label` to accept node type
- `limestone/TimePicker` flickering on the hour picker when the meridiem value change

## [1.0.0] - 2025-06-13

### Added

- `limestone/Chips`, a new container component that groups and manages multiple `limestone/Chips.Chip` for improved layout and interaction

### Changed

- `limestone/Chips.Chip` styling to match the latest GUI
- `limestone/TabLayout` styling to match the latest GUI

## [1.0.0-rc.2] - 2025-06-04

### Changed

- `limestone/ContextualMenuDecorator` styling to match the latest GUI
- `limestone/FixedPopupPanels` styling to match the latest GUI

### Fixed

- `limestone/TabLayout` to focus to the last focused tab when focus enters to the tab group

## [1.0.0-rc.1] - 2025-05-29

### Added

- `limestone/Icon` supported icon list, adding new icons
- `limestone/TabLayout` prop `primaryIndex` to focus primary tab when pressing back key from other tabs or initial rendering

### Changed

- `limestone/BodyText` styling to match the latest GUI
- `limestone/DatePicker` styling to match the latest GUI
- `limestone/DayPicker` styling to match the latest GUI
- `limestone/Heading` prop `size` default value to `tiny` and styling to match the latest GUI
- `limestone/PageViews` styling to match the latest GUI
- `limestone/Panels` styling to match the latest GUI
- `limestone/Panels.Header` styling to match the latest GUI
- `limestone/PopupTabLayout` styling to match the latest GUI
- `limestone/ProgressButton` styling to match the latest GUI
- `limestone/Steps` styling to match the latest GUI
- `limestone/Switch` styling to match the latest GUI
- `limestone/SwitchItem` styling to match the latest GUI
- `limestone/WizardPanels` styling to match the latest GUI

### Fixed

- `limestone/ContextualPopupDecorator` to update popup position properly when Wrapped component updated
- `limestone/Input.InputField` to receive focus properly when navigating with directional keys
- `limestone/Input.InputField` to receive focus properly when not contained in the same SpotlightContainer

## [1.0.0-beta.1] - 2025-04-29

### Added

- `limestone/Card` prop `secondaryLabel`

### Changed

- `limestone/Button` styling to match the latest GUI
- `limestone/Checkbox` styling to match the latest GUI
- `limestone/Dropdown` styling to match the latest GUI
- `limestone/Input.InputField` styling to match the latest GUI
- `limestone/Item` styling to match the latest GUI
- `limestone/Picker` styling to match the latest GUI
- `limestone/ProgressBar` styling to match the latest GUI
- `limestone/RadioItem` styling to match the latest GUI
- `limestone/Scroller` styling to match the latest GUI
- `limestone/Tab` styling to match the latest GUI
- `limestone/VirtualList` styling to match the latest GUI
- `limestone/WizardPanels` to marquee subtitle

### Fixed

- `limestone/ContextualPopupDecorator` to focus content only after the state has been updated when popup opens
- `limestone/Scroller` with `editable` prop to not move hidden items

## [1.0.0-alpha.1] - 2025-04-04

Initial alpha release.
