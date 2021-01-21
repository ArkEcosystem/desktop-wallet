import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Section } from "app/components/Layout";
import { LineChart } from "app/components/LineChart";
import { PercentageBar } from "app/components/PercentageBar";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { usePortfolioData } from "./hooks";

type PortfolioChartProps = {
	profile: Profile;
	isVisible?: boolean;
	showChartAnimation?: boolean;
};

export const PortfolioChart = memo(({ profile, isVisible = true, showChartAnimation }: PortfolioChartProps) => {
	const { t } = useTranslation();
	const { percentages, balances, chartLines } = usePortfolioData({ profile });

	// TODO: Set dashboard config showChartAnimation to false when unmount

	if (!isVisible || !balances.length) {
		return <></>;
	}

	return (
		<Section>
			<div className="-mb-2 text-4xl font-bold">{t("DASHBOARD.DASHBOARD_PAGE.CHART.TITLE")}</div>
			<LineChart
				showAnimation={showChartAnimation}
				height={260}
				period="22 Jun - 28 Jun"
				data={balances}
				lines={chartLines}
			/>

			{!profile.balance().isZero() && (
				<>
					<div className="pt-6 mb-2 border-b border-dashed border-theme-secondary-300 dark:border-theme-secondary-800" />

					<PercentageBar title={t("DASHBOARD.DASHBOARD_PAGE.CHART.PERCENTAGES_LABEL")} data={percentages} />
				</>
			)}
		</Section>
	);
});
