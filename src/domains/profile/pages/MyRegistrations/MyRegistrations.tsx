import { ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { Loader } from "app/components/Loader";
import { useActiveProfile } from "app/hooks/env";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { BlockchainTable } from "./components/BlockchainTable";
import { BusinessTable } from "./components/BusinessTable";
import { DelegateTable } from "./components/DelegateTable";

const { RegisterBanner } = images.common;

const EmptyRegistrations = () => {
	const { t } = useTranslation();

	return (
		<Section className="flex-1">
			<div data-testid="MyRegistrations__empty-state" className="text-center">
				<RegisterBanner className="mx-auto" />

				<div className="mt-8 text-theme-neutral-dark">
					{t("PROFILE.PAGE_MY_REGISTRATIONS.NO_REGISTRATIONS_MESSAGE")}
				</div>
			</div>
		</Section>
	);
};

type Props = {
	blockchainRegistrations: any[];
};

export const MyRegistrations = ({ blockchainRegistrations }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [blockchain] = useState(blockchainRegistrations);
	const [delegates, setDelegates] = useState<ReadWriteWallet[]>([]);
	const [businesses, setBusinesses] = useState<ExtendedTransactionData[]>([]);

	const history = useHistory();
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();

	const isEmptyRegistrations = useMemo(
		() => !isLoading && !delegates.length && !blockchain.length && !businesses.length,
		[businesses, delegates, blockchain, isLoading],
	);

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const handleAction = ({ action, walletId }: any) => {
		switch (action) {
			case "register":
				//TODO: Determine wallet selection. Which wallet should be registered?
				history.push(`/profiles/${activeProfile.id()}/transactions/registration`);
				break;
			case "resign":
				history.push(`/profiles/${activeProfile.id()}/transactions/${walletId}/resignation`);
				break;
			case "update":
				history.push(`/profiles/${activeProfile.id()}/transactions/${walletId}/update`);
				break;
		}
	};

	useEffect(() => {
		const fetchRegistrations = async () => {
			setIsLoading(true);

			activeProfile.entityRegistrationAggregate().flush();

			const businessRegistrations = await activeProfile.entityRegistrationAggregate().businesses();
			setBusinesses(businessRegistrations.items());

			const delegateRegistrations = activeProfile.registrationAggregate().delegates();
			setDelegates(delegateRegistrations);

			setIsLoading(false);
		};
		fetchRegistrations();
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
								<Button
									data-testid="MyRegistrations__cta-register"
									onClick={() => handleAction({ action: "register" })}
								>
									{t("COMMON.REGISTER")}
								</Button>
							</div>
						</div>
					}
				/>
			</Section>

			{isLoading && !isEmptyRegistrations && <Loader />}

			{!isLoading && businesses.length > 0 && <BusinessTable businesses={businesses} onAction={handleAction} />}
			{!isLoading && blockchain.length > 0 && <BlockchainTable data={blockchain} />}
			{!isLoading && delegates.length > 0 && <DelegateTable wallets={delegates} onAction={handleAction} />}

			{isEmptyRegistrations && <EmptyRegistrations />}
		</Page>
	);
};

MyRegistrations.defaultProps = {
	blockchainRegistrations: [],
};
