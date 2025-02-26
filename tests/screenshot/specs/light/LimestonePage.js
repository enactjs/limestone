'use strict';
const {Page} = require('@enact/ui-test-utils/utils');

class LimestonePage extends Page {
	constructor () {
		super();
		this.title = 'Limestone Test';
	}

	async open (urlExtra) {
		await super.open('Limestone-View', urlExtra);
	}

	get component () {
		return $('[data-ui-test-id="test"]');
	}
}

module.exports = new LimestonePage();
