import { Enums, ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { EmptyResults } from "app/components/EmptyResults";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { Loader } from "app/components/Loader";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
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
	const [entityDelegates, setEntityDelegates] = useState<ExtendedTransactionData[]>([]);
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

			const entityDelegateRegistrations = await activeProfile
				.entityAggregate()
				.registrations(Enums.EntityType.Delegate);

			setEntityDelegates(entityDelegateRegistrations.items());

			setPlugins(pluginRegistrations.items());

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

	// TODO: Find a better way to carry on entity from registrations to resign page
	// to avoid use state and also work better with loading states in the send entity resignation
	const handleAction = ({ action, walletId, entity, type }: any) => {
		switch (action) {
			case "register":
				history.push(`/profiles/${activeProfile.id()}/send-entity-registration`);
				break;

			case "update":
				history.push(
					`/profiles/${activeProfile.id()}/wallets/${walletId}/transactions/${entity.id()}/send-entity-update`,
				);
				break;

			case "resign":
				history.push(
					`/profiles/${activeProfile.id()}/wallets/${walletId}/transactions/${entity.id()}/send-entity-resignation`,
				);
				break;

			case "updateDelegate":
				history.push(`/profiles/${activeProfile.id()}/wallets/${walletId}/delegate/send-entity-registration`);
				break;

			case "resignDelegate":
				history.push(`/profiles/${activeProfile.id()}/wallets/${walletId}/send-entity-resignation`);
				break;
		}
	};

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
				<Section className="flex-1">
					<div data-testid="BusinessRegistrations">
						<EntityTable
							title={t("PROFILE.PAGE_MY_REGISTRATIONS.BUSINESS")}
							nameColumnHeader={t("PROFILE.PAGE_MY_REGISTRATIONS.BUSINESS_NAME")}
							type="entity"
							entities={businessEntities}
							onAction={handleAction}
						/>
					</div>
				</Section>
			)}

			{!isLoading && pluginEntities.length > 0 && (
				<Section className="flex-1">
					<div data-testid="PluginRegistrations">
						<EntityTable
							nameColumnHeader={t("PROFILE.PAGE_MY_REGISTRATIONS.PLUGIN_NAME")}
							title={t("PROFILE.PAGE_MY_REGISTRATIONS.PLUGINS")}
							type="entity"
							entities={pluginEntities}
							onAction={handleAction}
						/>
					</div>
				</Section>
			)}

			{!isLoading && delegateWallets.length > 0 && !entityDelegates.length && (
				<Section className="flex-1">
					<div data-testid="DelegateRegistrations">
						<DelegateTable wallets={delegateWallets} onAction={handleAction} />
					</div>
				</Section>
			)}

			{!isLoading && entityDelegates.length > 0 && (
				<Section className="flex-1">
					<div data-testid="EntityDelegateRegistrations">
						<EntityTable
							nameColumnHeader={t("PROFILE.PAGE_MY_REGISTRATIONS.DELEGATE_NAME")}
							title={t("PROFILE.PAGE_MY_REGISTRATIONS.DELEGATE")}
							type="entity"
							entities={entityDelegates}
							onAction={handleAction}
						/>
					</div>
				</Section>
			)}

			{hasNoRegistrations && <EmptyRegistrations />}

			{!hasNoRegistrations && showEmptySearchResults && (
				<Section className="flex-1">
					<EmptyResults
						className="flex-1"
						title={t("COMMON.EMPTY_RESULTS.TITLE")}
						subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
					/>
				</Section>
			)}
		</Page>
	);
};
