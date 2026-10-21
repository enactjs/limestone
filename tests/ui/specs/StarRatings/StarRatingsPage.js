'use strict';
const {Page} = require('@enact/ui-test-utils/utils');

class StarRatingsInterface {
	constructor (id) {
		this.id = `${id}`;
	}

	get self () {
		return $(`#${this.id}`);
	}

	get isReadOnly () {
		return $(`#${this.id}.StarRatings_StarRatings_readOnly`).isExisting();
	}

	get isDisabled () {
		return $(`#${this.id}.StarRatings_StarRatings_disabled`).isExisting();
	}

	star (number) {
		return $(`#${this.id}-star-${number}`);
	}

	// `--star-fill` of a star, e.g. '100%', '50%' or '0%'
	async fill (number) {
		return await browser.execute((el) => el.style.getPropertyValue('--star-fill'), await this.star(number));
	}

	async fills () {
		const fills = [];
		for (let number = 1; number <= 5; number++) {
			fills.push(await this.fill(number));
		}
		return fills;
	}

	async filledStars () {
		return (await this.fills()).filter((fill) => fill === '100%').length;
	}

	// The focus outline is drawn by the focused star's `::before`
	async hasFocusOutline (number) {
		return await browser.execute((el) => window.getComputedStyle(el, '::before').content !== 'none', await this.star(number));
	}

	async starLeft (number) {
		return (await this.star(number).getLocation()).x;
	}
}

class StarRatingsPage extends Page {
	constructor () {
		super();
		this.title = 'StarRatings Test';
		const starRatingsDefault = new StarRatingsInterface('starRatingsDefault');
		const starRatingsReadOnly = new StarRatingsInterface('starRatingsReadOnly');
		const starRatingsDisabled = new StarRatingsInterface('starRatingsDisabled');

		this.components = {
			starRatingsDefault,
			starRatingsReadOnly,
			starRatingsDisabled
		};
	}

	// Value from the last `onChange` call, or 'none'
	get lastChange () {
		return $('#lastChange').getText();
	}

	get focusedId () {
		return browser.execute(() => document.activeElement && document.activeElement.id);
	}

	async open (urlExtra) {
		await super.open('StarRatings-View', urlExtra);
	}
}

module.exports = new StarRatingsPage();
