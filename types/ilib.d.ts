declare module 'ilib/lib/DateFactory' {
	/**
	 * An ilib calendar-date instance (e.g. `GregorianDate`, `HebrewDate`, etc.) as returned by
	 * `DateFactory()`. Field/method names and types here are verified against the real
	 * ilib@14.21.0 source (`lib/IDate.js`, `lib/GregorianDate.js`) -- not guessed.
	 */
	interface IDate {
		year: number;
		month: number;
		day: number;
		hour: number;
		minute: number;
		second: number;
		millisecond: number;
		timezone: string;

		/** The `Calendar` instance (e.g. `GregorianCal`) backing this date's calendar system. */
		cal: {
			getMonLength(month: number, year: number): number;
			[key: string]: any;
		};

		/** Milliseconds since the epoch, per ilib's extended (wider-range) time representation. */
		getTimeExtended(): number;

		/** The equivalent native JS `Date`, or `undefined` if this date's time is out of JS `Date`'s range. */
		getJSDate(): Date | undefined;

		[key: string]: any;
	}

	/**
	 * Constructs (or re-derives, when passed an existing `IDate`-like object) an ilib date
	 * instance. `options`/the input object may include `unixtime`, `timezone`, `locale`,
	 * `type`/`calendar`, and other ilib date-construction fields; typed loosely since the real
	 * implementation accepts either a plain options object or an existing `IDate` via duck typing.
	 */
	function DateFactory(options?: Record<string, any>): IDate;

	export default DateFactory;
	export type {IDate};
}

declare module 'ilib/lib/IString' {
	/**
	 * A locale-aware, immutable string wrapper. Verified against the real ilib@14.21.0 source
	 * (`lib/IString.js`) -- not guessed. Only the members actually used by this package's `$L`
	 * module are declared; `IString` has many more string-manipulation methods in the real source
	 * (`charAt`, `split`, `format`, etc.) that can be added here if a future consumer needs them.
	 */
	class IString {
		constructor(str?: string | IString);

		/** The underlying plain-string value. */
		str: string;

		toString(): string;
		valueOf(): string;
	}

	export default IString;
}

declare module 'ilib/lib/ResBundle' {
	import type IString from 'ilib/lib/IString';

	/**
	 * A locale-specific bundle of translated strings. Verified against the real ilib@14.21.0
	 * source (`lib/ResBundle.js`) -- not guessed.
	 */
	class ResBundle {
		constructor(options?: Record<string, any>);

		/**
		 * Looks up the translated string for `source` (optionally disambiguated by `key`).
		 * `escapeMode` controls how the result is escaped for embedding (e.g. `'xml'`, `'html'`).
		 */
		getString(source: string, key?: string, escapeMode?: string): IString;

		/** Cache of loaded strings for the default resource name, set dynamically at runtime. */
		static strings?: any;
		/** Cache of loaded system-resource strings, set dynamically at runtime. */
		static sysres?: any;
	}

	export default ResBundle;
}
