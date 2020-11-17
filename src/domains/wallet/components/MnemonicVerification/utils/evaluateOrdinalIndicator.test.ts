import { getOrdinalIndicator } from "./evaluateOrdinalIndicator";

describe("Ordinal Indicator evaluation", () => {
	it("should return the right ordinal indicator", () => {
		expect(getOrdinalIndicator(1)).toEqual("st");
		expect(getOrdinalIndicator(2)).toEqual("nd");
		expect(getOrdinalIndicator(3)).toEqual("rd");
		expect(getOrdinalIndicator(4)).toEqual("th");
		expect(getOrdinalIndicator(5)).toEqual("th");
		expect(getOrdinalIndicator(6)).toEqual("th");
		expect(getOrdinalIndicator(7)).toEqual("th");
		expect(getOrdinalIndicator(8)).toEqual("th");
		expect(getOrdinalIndicator(9)).toEqual("th");
		expect(getOrdinalIndicator(10)).toEqual("th");
	});
});
