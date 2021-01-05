import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import { BarItem } from "app/components/PercentageBar";
import { useEnvironmentContext } from "app/contexts";
import { getNetworkExtendedData } from "domains/network/helpers";
import { useMemo } from "react";

import { balances } from "../../data";

export const usePortfolioData = ({ profile }: { profile: Profile }) => {
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
					const extended = getNetworkExtendedData({ coin: network.coin(), network: network.id() });
					return Object.assign(network, { extra: extended });
				}),
		[env],
	);

	const balancePerCoin = useMemo(() => profile.walletAggregate().balancePerCoin(), [profile]);

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
