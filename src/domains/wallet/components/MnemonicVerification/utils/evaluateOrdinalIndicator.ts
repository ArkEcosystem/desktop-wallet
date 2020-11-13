const ordinalPluralizer = new Intl.PluralRules("en", { type: "ordinal" });

const SUFFIXES = {
	zero: "",
	one: "st",
	two: "nd",
	few: "rd",
	other: "th",
	many: "th",
};

export const getOrdinalIndicator = (number: number) => SUFFIXES[ordinalPluralizer.select(number)];
