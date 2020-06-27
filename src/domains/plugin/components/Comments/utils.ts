import { DateTime } from "@arkecosystem/platform-sdk-intl";

export const getDateDifferenceFromNow = (targetDate: string): string => {
	const currentDateObj = DateTime.make();
	const dateToCompare = DateTime.make(targetDate);
	const dateDifference = currentDateObj.diffInDays(dateToCompare);

	const dateComplement = dateDifference > 1 ? "days" : "day";

	return `${dateDifference} ${dateComplement} ago`;
};
