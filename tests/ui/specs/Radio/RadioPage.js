'use strict';
const {Page} = require('@enact/ui-test-utils/utils');

class RadioInterface {
	constructor (id) {
		this.id = `${id}`;
	}

	get self () {
		return $(`#${this.id}`);
	}

	get isChecked () {
		return $(`#${this.id}.Radio_Radio_selected`).isExisting();
	}
}

class RadioPage extends Page {
	constructor () {
		super();
		this.title = 'Radio Test';
		const normalRadio = new RadioInterface('normalRadio');
		const labeledRadio = new RadioInterface('labeledRadio');
		const selectedRadio = new RadioInterface('selectedRadio');
		const disabledRadio = new RadioInterface('disabledRadio');

		this.components = {
			normalRadio,
			labeledRadio,
			selectedRadio,
			disabledRadio
		};
	}

	async open (urlExtra) {
		await super.open('Radio-View', urlExtra);
	}
}

module.exports = new RadioPage();
