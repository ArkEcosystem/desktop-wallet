import { getDateDifferenceFromNow } from "./utils";

describe("getDateDifferenceFromNow", () => {
	it("should return string with days ago from now", () => {
		const targetDate = "2020-06-22T14:48:00.000Z";

		expect(getDateDifferenceFromNow(targetDate)).toEqual("8 days ago");
	});
});
