import { sortBy, uniq } from "@arkecosystem/utils";

export const validatePattern = (t: any, value: string, regexp: RegExp) => {
	const matches = value.split(regexp).reduce((acc, curr) => (curr ? acc + curr : acc), "");

	return matches.length
		? t("COMMON.VALIDATION.ILLEGAL_CHARACTERS", {
				characters: sortBy(uniq(matches.split("")))
					.map((char) => `'${char}'`)
					.join(", "),
		  })
		: true;
};
