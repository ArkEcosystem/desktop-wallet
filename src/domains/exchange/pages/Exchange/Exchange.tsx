import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
import { AddExchange } from "domains/exchange/components/AddExchange";
import { PluginUninstallConfirmation } from "domains/plugin/components/PluginUninstallConfirmation/PluginUninstallConfirmation";
import { PluginController, usePluginManagerContext } from "plugins";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { ExchangeGrid } from "../../components/ExchangeGrid";

const ExchangeHeaderExtra = ({ onAddExchange }: { onAddExchange: any }) => {
	const { t } = useTranslation();

	return (
		<div className="flex justify-end items-top">
			<Button data-testid="Exchange__add-exchange-button" className="whitespace-nowrap" onClick={onAddExchange}>
				{t("EXCHANGE.PAGE_EXCHANGES.ADD_EXCHANGE")}
			</Button>
		</div>
	);
};

export const Exchange = () => {
	const activeProfile = useActiveProfile();
	const history = useHistory();

	const [isAddExchangeOpen, setIsAddExchangeOpen] = useState(false);
	const [selectedExchange, setSelectedExchange] = useState<PluginController | undefined>(undefined);

	const { mapConfigToPluginData, pluginManager } = usePluginManagerContext();

	const { t } = useTranslation();

	const installedPlugins = pluginManager
		.plugins()
		.all()
		.map((item) => item.config())
		.map(mapConfigToPluginData.bind(null, activeProfile));

	const exchanges = installedPlugins.filter((plugin) => plugin.category === "exchange" && plugin.isEnabled);

	if (!exchanges.length || exchanges.length < 3) {
		exchanges.push(...new Array(3 - exchanges.length).fill(undefined));
	}

	const handleLaunchExchange = (exchange: any) => {
		history.push(`/profiles/${activeProfile.id()}/exchange/view?pluginId=${exchange.id}`);
	};

	const handleDeleteExchange = (exchange: any) => {
		setSelectedExchange(pluginManager.plugins().findById(exchange.id));
	};

	const handleOpenExchangeDetails = (exchange: any) => {
		history.push(`/profiles/${activeProfile.id()}/plugins/details?pluginId=${exchange.id}`);
	};

	return (
		<>
			<Page profile={activeProfile} isBackDisabled={true} data-testid="Exchange">
				<Section border>
					<Header
						title={t("EXCHANGE.PAGE_EXCHANGES.TITLE")}
						subtitle={t("EXCHANGE.PAGE_EXCHANGES.SUBTITLE")}
						extra={<ExchangeHeaderExtra onAddExchange={() => setIsAddExchangeOpen(true)} />}
					/>
				</Section>

				<Section>
					<ExchangeGrid
						exchanges={exchanges}
						onClick={handleLaunchExchange}
						onDelete={handleDeleteExchange}
						onOpenDetails={handleOpenExchangeDetails}
					/>
				</Section>
			</Page>

			<AddExchange isOpen={isAddExchangeOpen} onClose={() => setIsAddExchangeOpen(false)} />

			{selectedExchange && (
				<PluginUninstallConfirmation
					isOpen={true}
					plugin={selectedExchange}
					profile={activeProfile}
					onClose={() => setSelectedExchange(undefined)}
					onDelete={() => setSelectedExchange(undefined)}
				/>
			)}
		</>
	);
};
