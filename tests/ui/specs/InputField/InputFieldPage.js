'use strict';
const {Page} = require('@enact/ui-test-utils/utils');

class SpotlightMultiplePage extends Page {
	constructor () {
		super();
		this.title = 'InputField Test';
	}

	async open (urlExtra) {
		await super.open('InputField-View', urlExtra);
	}

	get input1 () {
		return $('#input1');
	}
	get input2 () {
		return $('#input2');
	}
	get input3 () {
		return $('#input3');
	}
	get input4 () {
		return $('#input4');
	}
	get disabledInput () {
		return $('#input5');
	}
	get input6 () {
		return $('#input6');
	}
	get inputElement1 () {
		return $('#input1 input');
	}

	isMarqueeAnimating (id) {
		return $(`#${id} .enact_ui_Marquee_Marquee_animate`).isExisting();
	}
}

module.exports = new SpotlightMultiplePage();
