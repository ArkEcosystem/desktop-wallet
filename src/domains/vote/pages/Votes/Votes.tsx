import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks";
import { AddressTable } from "domains/vote/components/AddressTable";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const Votes = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	console.log("Wallets - allByCoin", activeProfile.wallets().allByCoin());

	const walletsByCoin = useMemo(() => {
		const wallets = activeProfile.wallets().allByCoin();

		return Object.keys(wallets).reduce(
			(acc, coin) => ({
				...acc,
				[coin]: Object.values(wallets[coin]),
			}),
			{} as any,
		);
	}, [activeProfile]);

	console.log("walletsByCoin", walletsByCoin);

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("VOTE.VOTES_PAGE.TITLE")}
					subtitle={t("VOTE.VOTES_PAGE.SUBTITLE")}
					extra={<HeaderSearchBar placeholder={t("VOTE.VOTES_PAGE.SEARCH_PLACEHOLDER")} />}
				/>
			</Section>

			{Object.keys(walletsByCoin).map((coin, index) => (
				<Section className="flex-1" key={index}>
					<AddressTable wallets={walletsByCoin[coin]} />
				</Section>
			))}
		</Page>
	);
};
