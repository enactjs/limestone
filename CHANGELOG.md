# Change Log

The following is a curated list of changes in the Enact limestone module, newest changes on the top.

## [unreleased]

### Added

- `limestone/VirtualList` prop `continue5WayHold` to scroll continuously from in a VirtualList to the outer scroller.

### Fixed

- `limestone/Card` to block select on `keyDown` instead of `keyUp` when `disabled`
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
