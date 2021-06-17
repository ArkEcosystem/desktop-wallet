import { DropdownOption } from "app/components/Dropdown";
import { BlankPluginCard, PluginCard } from "domains/plugin/components/PluginCard";
import React from "react";
import { useTranslation } from "react-i18next";

interface ExchangeCardProperties {
	actions?: DropdownOption[];
	exchange: any;
	onClick: any;
	onSelect: any;
}

export const ExchangeCard = ({ exchange, ...properties }: ExchangeCardProperties) => {
	const { t } = useTranslation();

	if (exchange === undefined) {
		return <BlankPluginCard name={t("PLUGINS.CATEGORIES.EXCHANGE")} />;
	}

	return <PluginCard plugin={exchange} showCategory={false} {...properties} />;
};
