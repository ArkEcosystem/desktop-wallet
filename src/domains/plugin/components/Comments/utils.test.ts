import { getDateDifferenceFromNow } from "./utils";

describe("getDateDifferenceFromNow", () => {
	it("should return string with days ago from now", () => {
		const targetDate = "2020-07-01T00:00:00.000Z";

		expect(getDateDifferenceFromNow(targetDate)).toEqual("0 day ago");
	});
});
