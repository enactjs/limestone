/**
 * Provides Limestone styled Chips and Chip comoponents and behaviors.
 *
 * @module limestone/Chips
 * @exports Chip
 * @exports ChipBase
 * @exports ChipDecorator
 * @exports Chips
 * @exports ChipsBase
 * @exports ChipsDecorator
 */

import Chip, {ChipBase, ChipDecorator} from './Chip';
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
	Chips,
	ChipsBase,
	ChipsDecorator
};
