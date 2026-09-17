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
