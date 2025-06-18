# Change Log

The following is a curated list of changes in the Enact limestone module, newest changes on the top.

## [unreleased]

### Added

- `limestone/Icon` supported icon list, adding new icons

### Changed

- `limestone/Alert` styling to match the latest GUI
- `limestone/ImageItem` styling to match the latest GUI

### Fixed

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
- `limestone/Button` styling to match the latest GUI
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
