async function focusedElement () {
	return await browser.execute(function () {
		return document.activeElement.id;
	});
}

async function hitTest (_selector) {
	return await browser.execute(function (selector) {
		const
			target = document.querySelector(selector),
			targetRect = target.getBoundingClientRect(),
			targetDown = [targetRect.x + (targetRect.width / 2), targetRect.y + targetRect.height - 1],
			targetTop = [targetRect.x + (targetRect.width / 2), targetRect.y + 1];
		return target.contains(document.elementFromPoint(...targetDown)) || target.contains(document.elementFromPoint(...targetTop));
	}, _selector);
}

async function expectFocusedItem (itemNum) {
	const focusedId = await focusedElement();
	expect(focusedId).toBe(`item${itemNum}`);
}

async function expectNoFocusedItem () {
	expect(await browser.execute(function () {
		return document.activeElement === document.body;
	})).toBe(true);
}

async function waitUntilFocused (itemNum, comment = '') {
	const target = `item${itemNum}`;
	if (comment) {
		comment = ': ' + comment;
	}
	await browser.waitUntil(async function () {
		const focusedId = await focusedElement();
		return target === focusedId;
	}, {timeout: 1500, timeoutMsg: `timed out waiting to focus index ${itemNum}${comment}`});
	await browser.pause(500);
}

async function waitUntilVisible (itemNum) {
	await browser.waitUntil(function () {
		return hitTest(`#item${itemNum}`);
	},  {timeout: 1500, timeoutMsg: `timed out waiting until visible index ${itemNum}`});
	await browser.pause(500);
}

async function isScrolling () {
	return (await $('#scrolling').getText()) === 'Scrolling';
}

async function isNotScrolling () {
	return (await $('#scrolling').getText()) === 'Not Scrolling';
}

/**
 * Waits for scrolling to start, then stop
 *
 * @param {Number} [timeout=3000]
 */
async function waitForScrollStartStop (timeout = 3000) {
	await browser.waitUntil(await isScrolling, {timeout});
	await browser.waitUntil(await isNotScrolling, {timeout});
}

async function focusById (id) {
	await browser.execute(function (targetId) {
		document.getElementById(targetId).focus();
	}, id);
	await browser.pause(200);
}

async function holdDownKey (repeatCount) {
	await browser.execute(function () {
		window.repeatKeyDownCount = 0;
		window.addEventListener('keydown', function (ev) {
			if (ev.repeat) {
				window.repeatKeyDownCount++;
			}
		});
	});
	for (let i = 0; i < repeatCount; i++) {
		await browser.execute(function (repeat) {
			// eslint-disable-next-line no-undef
			const event = new KeyboardEvent('keydown', {bubbles: true, cancelable: true, code: 'ArrowDown', key: 'ArrowDown', keyCode: 40, repeat});
			document.activeElement.dispatchEvent(event);
		}, i > 0);
		await browser.pause(50);
	}
	await browser.execute(function () {
		// eslint-disable-next-line no-undef
		const event = new KeyboardEvent('keyup', {bubbles: true, cancelable: true, code: 'ArrowDown', key: 'ArrowDown', keyCode: 40});
		document.activeElement.dispatchEvent(event);
	});

	return await browser.execute(function () {
		return window.repeatKeyDownCount;
	});
}

exports.expectFocusedItem = expectFocusedItem;
exports.expectNoFocusedItem = expectNoFocusedItem;
exports.focusById = focusById;
exports.focusedElement = focusedElement;
exports.holdDownKey = holdDownKey;
exports.waitForScrollStartStop = waitForScrollStartStop;
exports.waitUntilFocused = waitUntilFocused;
exports.waitUntilVisible = waitUntilVisible;
