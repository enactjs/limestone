/**
 * Provides Limestone styled Chips and Chip comoponents and behaviors.
 *
 * @example
 * <Chips orientation="horizontal">
 * 		<Chip key="key1">
 *			Chip 1
 *		</Chip>
 * 		<Chip key="key2" icon="check" deleteButton={{position: 'bottom'}}>
 * 			Chip 2
 * 		</Chip>
 * 		<Chip key="key3" icon="heart" deleteButton={{position: 'right'}}>
 * 			Chip 3
 * 		</Chip>
 * </Chips>
 *
 * @module limestone/Chips
 * @exports Chip
 * @exports ChipBase
 * @exports ChipDecorator
 * @exports chipDeleteButtonShape
 * @exports Chips
 * @exports ChipsBase
 * @exports ChipsDecorator
 */

import Chip, {ChipBase, ChipDecorator, chipDeleteButtonShape} from './Chip';
import Chips, {ChipsBase, ChipsDecorator} from './Chips';

/**
 * A shortcut to access {@link limestone/Chips.Chip}
 *
 * @name Chip
 * @static
 * @memberof limestone/Chips.Chips
 */
Chips.Chip = Chip;

export default Chips;
export {
	Chip,
	ChipBase,
	ChipDecorator,
	chipDeleteButtonShape,
	Chips,
	ChipsBase,
	ChipsDecorator
};
