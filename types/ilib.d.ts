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

declare module 'ilib/lib/ResBundle' {
	/**
	 * An ilib resource bundle, used to look up and translate strings for a locale. Field/method
	 * names verified against the real ilib@14.22.0 source (`lib/ResBundle.js`) -- not guessed;
	 * typed loosely (constructor options, `getString`/`getStringJS` source/key/escapeMode
	 * arguments) since callers in this codebase construct instances and pass them through
	 * opaquely (e.g. Enact's `$L`/`getIStringFromBundle`) rather than reading their fields.
	 */
	class ResBundle {
		constructor(options?: Record<string, any>);

		/**
		 * Caches ilib populates lazily on the constructor function itself (not per-instance).
		 * They don't exist until first use, which is why callers `delete` rather than reassign
		 * them to force a reload -- hence optional, to satisfy `delete`'s requirement that the
		 * operand be optional.
		 */
		static strings?: any;
		static sysres?: any;

		getLocale(): any;
		getName(): string;
		getType(): string;
		getString(source?: any, key?: string, escapeMode?: string): any;
		getStringJS(source?: any, key?: string, escapeMode?: string): string | string[] | undefined;
		containsKey(source?: string, key?: string): boolean;
		getResObj(): Record<string, any>;

		[key: string]: any;
	}

	export default ResBundle;
}

declare module 'ilib/lib/IString' {
	/**
	 * An ilib internationalized string -- a `String`-like wrapper supporting locale-aware
	 * formatting (`format`, `formatChoice`) and plural rules. Constructor and the methods used in
	 * this codebase (`format`, `toString`) verified against the real ilib@14.22.0 source
	 * (`lib/IString.js`) -- not guessed; the rest of its large `String`-mirroring API (`charAt`,
	 * `slice`, `trim`, etc.) is covered loosely via the index signature since callers here only
	 * construct an instance and immediately `format()`/stringify it.
	 */
	class IString {
		constructor(string?: string | IString);

		/** Replaces each `{param}` placeholder in the string with the matching value from `params`. */
		format(params?: Record<string, any>): string;

		toString(): string;

		[key: string]: any;
	}

	export default IString;
}

declare module 'ilib/lib/DateFmt' {
	/**
	 * An ilib date formatter. Constructor and `getDaysOfWeek` (the only method used in this
	 * codebase) verified against the real ilib@14.22.0 source (`lib/DateFmt.js`) -- not guessed;
	 * the rest of its large formatting API (`format`, `formatRelative`, etc.) is covered loosely
	 * via the index signature.
	 */
	class DateFmt {
		/** `options.length` is one of `'short'|'medium'|'long'|'full'`, among other formatting options. */
		constructor(options?: Record<string, any>);

		/**
		 * Returns the (Sunday-first) names of the days of the week, in this formatter's length
		 * (or `options.length`, if given), for the current locale.
		 */
		getDaysOfWeek(options?: Record<string, any>): string[];

		[key: string]: any;
	}

	export default DateFmt;
}

declare module 'ilib/lib/LocaleInfo' {
	/**
	 * ilib's locale metadata (first day of week, weekend bounds, etc.) for a given locale.
	 * Constructor and the methods used in this codebase (`getFirstDayOfWeek`, `getWeekEndStart`,
	 * `getWeekEndEnd`, `getClock`) verified against the real ilib@14.22.0 source
	 * (`lib/LocaleInfo.js`) -- not guessed; the rest of its large metadata API is covered loosely
	 * via the index signature.
	 */
	class LocaleInfo {
		constructor(locale?: string | Record<string, any>);

		/** The 0-indexed (Sunday = 0) first day of the week for this locale. */
		getFirstDayOfWeek(): number;

		/** The 0-indexed (Sunday = 0) day the weekend starts on for this locale. */
		getWeekEndStart(): number;

		/** The 0-indexed (Sunday = 0) day the weekend ends on for this locale. */
		getWeekEndEnd(): number;

		/** The clock format for this locale, `'12'` or `'24'`. */
		getClock(): string;

		[key: string]: any;
	}

	export default LocaleInfo;
}
