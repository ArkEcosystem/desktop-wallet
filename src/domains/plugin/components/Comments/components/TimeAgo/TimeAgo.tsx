import { DateTime } from "@arkecosystem/platform-sdk-intl";
import React from "react";
import { useTranslation } from "react-i18next";

const dateDifference = (date: string) => {
	const now = DateTime.make();
	const target = DateTime.make(date);

	const yearDifference = now.diffInYears(target);
	if (yearDifference > 0) {
		return { count: yearDifference, key: "YEARS" };
	}

	const monthDifference = now.diffInMonths(target);
	if (monthDifference > 0) {
		return { count: monthDifference, key: "MONTHS" };
	}

	const dayDifference = now.diffInDays(target);
	if (dayDifference > 0) {
		return { count: dayDifference, key: "DAYS" };
	}

	const hourDifference = now.diffInHours(target);
	if (hourDifference > 0) {
		return { count: hourDifference, key: "HOURS" };
	}

	const minuteDifference = now.diffInMinutes(target);
	if (minuteDifference > 0) {
		return { count: minuteDifference, key: "MINUTES" };
	}

	return { key: "FEW_SECONDS" };
};

export const TimeAgo = ({ date }: { date: string }) => {
	const { t } = useTranslation();

	const { count, key } = dateDifference(date);

	return (
		<span data-testid="timeago">
			{count ? t(`COMMON.DATETIME.${key}_AGO`, { count }) : t(`COMMON.DATETIME.${key}_AGO`)}
		</span>
	);
};
