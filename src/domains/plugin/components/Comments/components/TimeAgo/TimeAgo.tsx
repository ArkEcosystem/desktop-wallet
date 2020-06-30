import { DateTime } from "@arkecosystem/platform-sdk-intl";
import React from "react";
import { useTranslation } from "react-i18next";

export const TimeAgo = ({ date }: { date: string }) => {
	const { t } = useTranslation();

	const currentDateObj = DateTime.make();
	const dateToCompare = DateTime.make(date);

	let diff;

	const yearDifference = currentDateObj.diffInYears(dateToCompare);
	if (yearDifference > 0) {
		diff = { count: yearDifference, key: "YEARS" };
	} else {
		const monthDifference = currentDateObj.diffInMonths(dateToCompare);
		if (monthDifference > 0) {
			diff = { count: monthDifference, key: "MONTHS" };
		} else {
			const dayDifference = currentDateObj.diffInDays(dateToCompare);
			if (dayDifference > 0) {
				diff = { count: dayDifference, key: "DAYS" };
			} else {
				const hourDifference = currentDateObj.diffInHours(dateToCompare);
				if (hourDifference > 0) {
					diff = { count: hourDifference, key: "HOURS" };
				} else {
					const minuteDifference = currentDateObj.diffInMinutes(dateToCompare);
					if (minuteDifference > 0) {
						diff = { count: minuteDifference, key: "MINUTES" };
					} else {
						diff = { key: "FEW_SECONDS" };
					}
				}
			}
		}
	}

	const { count, key } = diff;

	return (
		<span data-testid="timeago">
			{count ? t(`COMMON.DATETIME.${key}_AGO`, { count }) : t(`COMMON.DATETIME.${key}_AGO`)}
		</span>
	);
};
