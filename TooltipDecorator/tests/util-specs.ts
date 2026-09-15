import {getTransitionDurationInMs} from "../util";

describe('utils', () => {
	test('should convert transition duration to number', async () => {
		expect(getTransitionDurationInMs("0.2s")).toBe(200);
		expect(getTransitionDurationInMs("200ms")).toBe(200);
		expect(getTransitionDurationInMs("200")).toBe(0);
	});
});
