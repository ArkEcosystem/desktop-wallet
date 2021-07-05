import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import { BarItem } from "app/components/PercentageBar";
import { useEnvironmentContext } from "app/contexts";
import { getNetworkExtendedData } from "domains/network/helpers";
import { useMemo } from "react";

export const usePortfolioData = ({ profile }: { profile: Contracts.IProfile }) => {
	const balances = [
		{ btc: 2400, formatted: { btc: "0.26", usd: "1,000" }, label: "22 Jun, 2020", name: "Mon", usd: 1000 },
		{ btc: 5400, formatted: { btc: "0.58", usd: "3,000" }, label: "23 Jun, 2020", name: "Tue", usd: 3000 },
		{ btc: 1398, formatted: { btc: "0.15", usd: "15,100" }, label: "24 Jun, 2020", name: "Wed", usd: 15_100 },
		{ btc: 9800, formatted: { btc: "1.06", usd: "4,000" }, label: "25 Jun, 2020", name: "Thu", usd: 4000 },
		{ btc: 2000, formatted: { btc: "0.22", usd: "11,200" }, label: "26 Jun, 2020", name: "Fri", usd: 11_200 },
		{ btc: 4800, formatted: { btc: "0.52", usd: "3,000" }, label: "27 Jun, 2020", name: "Sat", usd: 3000 },
		{ btc: 18_000, formatted: { btc: "2.16", usd: "8,000" }, label: "28 Jun, 2020", name: "Sun", usd: 8000 },
	];

	const { env } = useEnvironmentContext();

	const chartLines = [
		{
			color: "warning-600",
			dataKey: "btc",
			label: "BTC",
		},
		{
			color: "success-600",
			dataKey: "usd",
			label: "USD",
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
						color: "primary-600",
						label: coin,
						percentage: Number(balancePerCoin[coin].percentage),
					});
				}
			}
		}

		return sortByDesc([...data], "percentage");
	}, [availableNetworks, balancePerCoin]);

	return {
		balances,
		chartLines,
		percentages,
	};
};
