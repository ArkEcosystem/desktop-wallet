import { Enums, ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { EmptyResults } from "app/components/EmptyResults";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { Loader } from "app/components/Loader";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { DelegateTable } from "./components/DelegateTable";
import { EntityTable } from "./components/EntityTable";
import { filterDelegates, filterEntities } from "./utils";

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
	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [delegates, setDelegates] = useState<ReadWriteWallet[]>([]);
	const [businesses, setBusinesses] = useState<ExtendedTransactionData[]>([]);
	const [plugins, setPlugins] = useState<ExtendedTransactionData[]>([]);

	const history = useHistory();
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();

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

	const { pluginEntities, businessEntities, delegateWallets } = useMemo(
		() => ({
			pluginEntities: filterEntities(plugins, query),
			businessEntities: filterEntities(businesses, query),
			delegateWallets: filterDelegates(delegates, env.delegates(), query),
		}),
		[query, plugins, businesses, delegates, env],
	);

	const showEmptySearchResults = useMemo(
		() => query.trim().length > 0 && !pluginEntities.length && !businessEntities.length && !delegateWallets.length,
		[pluginEntities, businessEntities, delegateWallets, query],
	);

	const hasNoRegistrations = useMemo(() => !isLoading && !delegates.length && !businesses.length && !plugins.length, [
		isLoading,
		delegates,
		businesses,
		plugins,
	]);

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("PROFILE.PAGE_MY_REGISTRATIONS.TITLE")}
					subtitle={t("PROFILE.PAGE_MY_REGISTRATIONS.SUBTITLE")}
					extra={
						<div className="flex justify-end space-x-10 divide-x divide-theme-neutral-300">
							<HeaderSearchBar
								onSearch={(q: string) => setQuery(q)}
								onReset={() => setQuery("")}
								debounceTimeout={100}
							/>
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

			{isLoading && !hasNoRegistrations && <Loader />}

			{!isLoading && businessEntities.length > 0 && (
				<div data-testid="BusinessRegistrations">
					<EntityTable
						title={t("PROFILE.PAGE_MY_REGISTRATIONS.BUSINESS")}
						nameColumnHeader={t("PROFILE.PAGE_MY_REGISTRATIONS.BUSINESS_NAME")}
						entities={businessEntities}
						onAction={handleAction}
					/>
				</div>
			)}

			{!isLoading && pluginEntities.length > 0 && (
				<div data-testid="PluginRegistrations">
					<EntityTable
						nameColumnHeader={t("PROFILE.PAGE_MY_REGISTRATIONS.PLUGIN_NAME")}
						title={t("PROFILE.PAGE_MY_REGISTRATIONS.PLUGINS")}
						entities={pluginEntities}
						onAction={handleAction}
					/>
				</div>
			)}

			{!isLoading && delegateWallets.length > 0 && (
				<div data-testid="DelegateRegistrations">
					<DelegateTable wallets={delegateWallets} onAction={handleAction} />
				</div>
			)}

			{hasNoRegistrations && <EmptyRegistrations />}

			{!hasNoRegistrations && showEmptySearchResults && (
				<EmptyResults
					className="flex-1"
					title={t("COMMON.EMPTY_RESULTS.TITLE")}
					subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
				/>
			)}
		</Page>
	);
};
