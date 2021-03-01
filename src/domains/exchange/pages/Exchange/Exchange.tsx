import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks";
import { AddExchange } from "domains/exchange/components/AddExchange";
import { usePluginManagerContext } from "plugins";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { ExchangeGrid } from "../../components/ExchangeGrid";

type ExchangeProps = {
	exchanges: any[];
};

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

	const [addExchangeIsOpen, setAddExchangeIsOpen] = useState(false);

	const { pluginManager, mapConfigToPluginData } = usePluginManagerContext();
	const { persist } = useEnvironmentContext();

	const { t } = useTranslation();

	const handleLaunchExchange = (exchange: any) => {
		history.push(`/profiles/${activeProfile.id()}/exchange/view?pluginId=${exchange.id}`);
	};

	const installedPlugins = pluginManager
		.plugins()
		.all()
		.map((item) => item.config())
		.map(mapConfigToPluginData.bind(null, activeProfile));

	const exchanges = installedPlugins.filter((plugin) => plugin.category === "exchange" && plugin.isEnabled);

	if (!exchanges.length || exchanges.length < 3) {
		exchanges.push(...new Array(3 - exchanges.length).fill(undefined));
	}

	return (
		<>
			<Page profile={activeProfile} isBackDisabled={true} data-testid="Exchange">
				<Section>
					<Header
						title={t("EXCHANGE.PAGE_EXCHANGES.TITLE")}
						subtitle={t("EXCHANGE.PAGE_EXCHANGES.SUBTITLE")}
						extra={<ExchangeHeaderExtra onAddExchange={() => setAddExchangeIsOpen(true)} />}
					/>
				</Section>

				<Section>
					<ExchangeGrid exchanges={exchanges} onLaunch={handleLaunchExchange} />
				</Section>
			</Page>

			<AddExchange isOpen={addExchangeIsOpen} onClose={() => setAddExchangeIsOpen(false)} />
		</>
	);
};
