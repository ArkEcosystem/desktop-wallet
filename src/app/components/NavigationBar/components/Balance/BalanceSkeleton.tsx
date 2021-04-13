import { Skeleton } from "app/components/Skeleton";
import React from "react";
import { useTranslation } from "react-i18next";

export const BalanceSkeleton = () => {
	const { t } = useTranslation();

	return (
		<div className="text-right">
			<div className="text-xs font-semibold text-theme-secondary-700">{t("COMMON.YOUR_BALANCE")}</div>
			<div className="text-sm font-bold text-theme-secondary-text dark:text-theme-text flex justify-end mt-1">
				<Skeleton height={14} width={60} />
			</div>
		</div>
	);
};
