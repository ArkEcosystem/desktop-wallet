import { shuffleOptions } from "../../utils/shuffleOptions";

describe("#shuffleOptions", () => {
    const options = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
    const value = "b";
    const limit = 7;
    
    it("should get diff results", () => {
        const result1 = shuffleOptions({ options, value, limit });
        const result2 = shuffleOptions({ options, value, limit });
        expect(result1).not.toEqual(result2);
    });

    it("should contain the value", () => {
        for (let index = 0; index < 10; index++) {
            expect(shuffleOptions({ options, value, limit })).toContain(value);
        }
    });

    it("should get limit length", () => {
        for (let index = 0; index < 10; index++) {
            expect(shuffleOptions({ options, value, limit })).toHaveLength(limit);
        }
    });
});