import { DropdownOption } from "app/components/Dropdown";
import { BlankPluginCard, PluginCard } from "domains/plugin/components/PluginCard";
import React from "react";
import { useTranslation } from "react-i18next";

type ExchangeCardProps = {
	actions?: DropdownOption[];
	exchange: any;
	onClick: any;
	onSelect: any;
};

export const ExchangeCard = ({ exchange, ...props }: ExchangeCardProps) => {
	const { t } = useTranslation();

	if (exchange === undefined) {
		return <BlankPluginCard name={t("PLUGINS.CATEGORIES.EXCHANGE")} />;
	}

	return <PluginCard plugin={exchange} showCategory={false} {...props} />;
};
