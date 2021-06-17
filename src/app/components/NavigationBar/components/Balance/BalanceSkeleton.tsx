import { Skeleton } from "app/components/Skeleton";
import React from "react";
import { useTranslation } from "react-i18next";

interface Properties {
	width?: number;
}

export const BalanceSkeleton = ({ width }: Properties) => {
	const { t } = useTranslation();

	return (
		<div className="text-right">
			<div className="text-xs font-semibold text-theme-secondary-500">{t("COMMON.YOUR_BALANCE")}</div>
			<div className="flex justify-end mt-1">
				<Skeleton height={16} width={width || 60} />
			</div>
		</div>
	);
};
