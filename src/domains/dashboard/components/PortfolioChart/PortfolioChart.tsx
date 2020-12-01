import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import { LineChart } from "app/components/LineChart";
import { BarItem, PercentageBar } from "app/components/PercentageBar";
import { useDashboardConfig } from "domains/dashboard/pages";
import { getNetworkExtendedData } from "domains/network/helpers";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { balances } from "../../data";

export const PortfolioChart = ({ profile, env }: { profile: Profile; env: Environment }) => {
	const { t } = useTranslation();

	const { getConfiguration } = useDashboardConfig({ profile });
	const { showChartAnimation, showPortfolio } = getConfiguration();
	console.log({ showChartAnimation, showPortfolio });

	const chartLines = [
		{
			dataKey: "btc",
			label: "BTC",
			color: "warning-600",
		},
		{
			dataKey: "usd",
			label: "USD",
			color: "success-600",
		},
	];

	const availableNetworks = useMemo(() => {
		console.log("useMemo 1");
		return env
			.availableNetworks()
			.filter((network) => network.isLive())
			.map((network) => {
				const extended = getNetworkExtendedData({ coin: network.coin(), network: network.id() });
				return Object.assign(network, { extra: extended });
			});
	}, [env]);

	const balancePerCoin = useMemo(() => {
		console.log(" useMemo 3");
		return profile.walletAggregate().balancePerCoin();
	}, [profile]);

	const portfolioPercentages = useMemo(() => {
		console.log(" useMemo 4");
		const data: BarItem[] = [];

		for (const coin of Object.keys(balancePerCoin)) {
			for (const network of availableNetworks) {
				if (network.extra && network.ticker() === coin) {
					data.push({
						color: network.extra.textClass.replace("text-theme-", ""),
						label: coin,
						percentage: Number(balancePerCoin[coin].percentage),
					});
				}
			}
		}

		return sortByDesc([...data], "percentage");
	}, [availableNetworks, balancePerCoin]);

	if (!showPortfolio || !balances.length) return <></>;

	return (
		<div>
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
					<div className="pt-6 mb-2 border-b border-dashed border-theme-neutral-300 dark:border-theme-neutral-800" />

					<PercentageBar
						title={t("DASHBOARD.DASHBOARD_PAGE.CHART.PERCENTAGES_LABEL")}
						data={portfolioPercentages}
					/>
				</>
			)}
		</div>
	);
};

PortfolioChart.defaultProps = {};
