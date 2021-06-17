import { sortBy, uniq } from "@arkecosystem/utils";

export const validatePattern = (t: any, value: string, regexp: RegExp) => {
	const matches = value
		.split(regexp)
		.reduce((accumulator, current) => (current ? accumulator + current : accumulator), "");

	return matches.length > 0
		? t("COMMON.VALIDATION.ILLEGAL_CHARACTERS", {
				characters: sortBy(uniq(matches.split("")))
					.map((char) => `'${char}'`)
					.join(", "),
		  })
		: true;
};
