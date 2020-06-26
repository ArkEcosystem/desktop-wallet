import moment from "moment";

export const getDateDifferenceFromNow = (targetDate: string): string => {
	const currentDateObj = moment();
	const dateToCompare = moment(targetDate);
	const dateDifference = currentDateObj.diff(dateToCompare, "days");

	const dateComplement = dateDifference > 1 ? "days" : "day";

	return `${dateDifference} ${dateComplement} ago`;
};
