import { getDateDifferenceFromNow } from "./utils";

jest.mock("moment", () => {
	return () => jest.requireActual("moment")("2020-06-22T14:48:00.000Z");
});

describe("getDateDifferenceFromNow", () => {
	it("should return string with days ago from now", () => {
		const targetDate = "2020-06-22T14:48:00.000Z";

		expect(getDateDifferenceFromNow(targetDate)).toEqual("0 day ago");
	});
});
