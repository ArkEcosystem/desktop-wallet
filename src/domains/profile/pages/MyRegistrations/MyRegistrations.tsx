import { Enums, ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
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

import { DelegateTable } from "./components/DelegateTable";
import { EntityTable } from "./components/EntityTable";

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

export const MyRegistrations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [delegates, setDelegates] = useState<ReadWriteWallet[]>([]);
	const [businesses, setBusinesses] = useState<ExtendedTransactionData[]>([]);
	const [plugins, setPlugins] = useState<ExtendedTransactionData[]>([]);

	const history = useHistory();
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();

	const isEmptyRegistrations = useMemo(
		() => !isLoading && !delegates.length && !businesses.length && !plugins.length,
		[isLoading, delegates, businesses, plugins],
	);

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const handleAction = ({ action, walletId, txId }: any) => {
		switch (action) {
			case "register":
				history.push(`/profiles/${activeProfile.id()}/send-entity-registration`);
				break;
			case "resign":
				history.push(`/profiles/${activeProfile.id()}/wallets/${walletId}/send-entity-resignation`);
				break;
			case "update":
				history.push(
					`/profiles/${activeProfile.id()}/wallets/${walletId}/transactions/${txId}/send-entity-update`,
				);
				break;
			case "updateDelegate":
				history.push(`/profiles/${activeProfile.id()}/wallets/${walletId}/send-entity-update`);
				break;
		}
	};

	useEffect(() => {
		const fetchRegistrations = async () => {
			setIsLoading(true);

			activeProfile.entityAggregate().flush();

			const pluginRegistrations = await activeProfile.entityAggregate().registrations(Enums.EntityType.Plugin);
			setPlugins(pluginRegistrations.items());

			const businessRegistrations = await activeProfile
				.entityAggregate()
				.registrations(Enums.EntityType.Business);
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

			{!isLoading && businesses.length > 0 && (
				<div data-testid="BusinessRegistrations">
					<EntityTable
						title={t("PROFILE.PAGE_MY_REGISTRATIONS.BUSINESS")}
						nameColumnHeader={t("PROFILE.PAGE_MY_REGISTRATIONS.BUSINESS_NAME")}
						entities={businesses}
						onAction={handleAction}
					/>
				</div>
			)}

			{!isLoading && plugins.length > 0 && (
				<div data-testid="PluginRegistrations">
					<EntityTable
						nameColumnHeader={t("PROFILE.PAGE_MY_REGISTRATIONS.PLUGIN_NAME")}
						title={t("PROFILE.PAGE_MY_REGISTRATIONS.PLUGINS")}
						entities={plugins}
						onAction={handleAction}
					/>
				</div>
			)}

			{!isLoading && delegates.length > 0 && <DelegateTable wallets={delegates} onAction={handleAction} />}

			{isEmptyRegistrations && <EmptyRegistrations />}
		</Page>
	);
};
