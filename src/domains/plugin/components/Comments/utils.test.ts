import MockDate from "mockdate";

import { getDateDifferenceFromNow } from "./utils";

beforeEach(() => MockDate.set(new Date("2020-06-22T14:48:00.000Z")));

afterEach(() => MockDate.reset());

describe("getDateDifferenceFromNow", () => {
	it("should return string with days ago from now", () => {
		const targetDate = "2020-06-22T14:48:00.000Z";

		expect(getDateDifferenceFromNow(targetDate)).toEqual("0 day ago");
	});
});
