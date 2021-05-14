import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import { BarItem } from "app/components/PercentageBar";
import { useEnvironmentContext } from "app/contexts";
import { getNetworkExtendedData } from "domains/network/helpers";
import { useMemo } from "react";

export const usePortfolioData = ({ profile }: { profile: Contracts.IProfile }) => {
	const balances = [
		{ name: "Mon", label: "22 Jun, 2020", usd: 1000, btc: 2400, formatted: { usd: "1,000", btc: "0.26" } },
		{ name: "Tue", label: "23 Jun, 2020", usd: 3000, btc: 5400, formatted: { usd: "3,000", btc: "0.58" } },
		{ name: "Wed", label: "24 Jun, 2020", usd: 15100, btc: 1398, formatted: { usd: "15,100", btc: "0.15" } },
		{ name: "Thu", label: "25 Jun, 2020", usd: 4000, btc: 9800, formatted: { usd: "4,000", btc: "1.06" } },
		{ name: "Fri", label: "26 Jun, 2020", usd: 11200, btc: 2000, formatted: { usd: "11,200", btc: "0.22" } },
		{ name: "Sat", label: "27 Jun, 2020", usd: 3000, btc: 4800, formatted: { usd: "3,000", btc: "0.52" } },
		{ name: "Sun", label: "28 Jun, 2020", usd: 8000, btc: 18000, formatted: { usd: "8,000", btc: "2.16" } },
	];

	const { env } = useEnvironmentContext();

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

	const availableNetworks = useMemo(
		() =>
			env
				.availableNetworks()
				.filter((network) => network.isLive())
				.map((network) => {
					const extended = getNetworkExtendedData(network.id());
					return Object.assign(network, { extra: extended });
				}),
		[env],
	);

	const balancePerCoin: any = useMemo(() => profile.portfolio().breakdown(), [profile]);

	const percentages = useMemo(() => {
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

	return {
		chartLines,
		percentages,
		balances,
	};
};
