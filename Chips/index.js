/**
 * Provides Limestone styled chip components and behaviors.
 *
 * Usage:
 * ```
 * <Chips>
 *		<Chips.Chip icon={icon} deleteButton={deleteButton}>
 *			label
 *		</Chips.Chip>
 * </Chips>
 * ```
 * @module limestone/Chips
 * @exports Chips
 */

 import Chips from './Chips';
 import Chip from './Chip';
 
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
    Chips
 };
 