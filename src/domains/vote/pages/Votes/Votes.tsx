import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks";
import React from "react";
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

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("VOTE.VOTES_PAGE.TITLE")}
					subtitle={t("VOTE.VOTES_PAGE.SUBTITLE")}
					extra={<HeaderSearchBar placeholder={t("VOTE.VOTES_PAGE.SEARCH_PLACEHOLDER")} />}
				/>
			</Section>
		</Page>
	);
};
