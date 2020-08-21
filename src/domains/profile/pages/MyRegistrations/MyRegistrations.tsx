import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks/env";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { BlockchainTable } from "./components/BlockchainTable";
import { BusinessTable } from "./components/BusinessTable";
import { DelegateTable } from "./components/DelegateTable";

type Props = {
	onAction?: any;
};

const { RegisterBanner } = images.common;

const EmptyRegistrations = () => {
	const { t } = useTranslation();

	return (
		<Section className="flex-1">
			<div data-testid="my-registrations__empty-state" className="text-center">
				<RegisterBanner className="mx-auto" />

				<div className="mt-8 text-theme-neutral-dark">
					{t("PROFILE.PAGE_MY_REGISTRATIONS.NO_REGISTRATIONS_MESSAGE")}
				</div>
			</div>
		</Section>
	);
};

export const MyRegistrations = () => {
	const [delegates, setDelegates] = useState<Wallet[]>([]);
	const [blockchain] = useState([]);
	const [business] = useState([]);

	const history = useHistory();
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();
	const wallets = useMemo(() => activeProfile.wallets().values(), [activeProfile]);

	const isEmptyRegistrations = !delegates.length && !blockchain.length && !business.length;

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const handleAction = ({ action, txId }: any) => {
		switch (action) {
			case "register":
				history.push(`/profiles/${activeProfile.id()}/transactions/registration`);
				break;
			case "resign":
				history.push(`/profiles/${activeProfile.id()}/transactions/${txId}/resignation`);
				break;
			case "update":
				history.push(`/profiles/${activeProfile.id()}/transactions/${txId}/update`);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		const getDelegates = () =>
			activeProfile
				.wallets()
				.values()
				.filter((wallet: Wallet) => wallet.isDelegate());

		setDelegates(getDelegates());
	}, [activeProfile]);

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("PROFILE.PAGE_MY_REGISTRATIONS.TITLE")}
					subtitle={t("PROFILE.PAGE_MY_REGISTRATIONS.SUBTITLE")}
					extra={
						<div className="flex justify-end space-x-10 divide-x divide-theme-neutral-300">
							<HeaderSearchBar onSearch={console.log} />
							<div className="pl-10">
								<Button onClick={() => handleAction({ action: "register" })}>
									{t("COMMON.REGISTER")}
								</Button>
							</div>
						</div>
					}
				/>
			</Section>

			{business.length > 0 && <BusinessTable data={business} onAction={handleAction} />}
			{blockchain.length > 0 && <BlockchainTable data={blockchain} onAction={handleAction} />}
			{delegates.length > 0 && <DelegateTable data={delegates} onAction={handleAction} />}

			{isEmptyRegistrations && <EmptyRegistrations />}
		</Page>
	);
};
