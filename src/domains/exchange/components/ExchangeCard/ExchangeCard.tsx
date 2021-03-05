import { Card } from "app/components/Card";
import { DropdownOption } from "app/components/Dropdown";
import { PluginCard } from "domains/plugin/components/PluginCard";
import React from "react";
import { useTranslation } from "react-i18next";

type ExchangeCardProps = {
	actions?: DropdownOption[];
	exchange: any;
	onClick: any;
	onSelect: any;
};

export const BlankExchangeCard = () => {
	const { t } = useTranslation();

	return (
		<Card>
			<div className="flex items-center space-x-4">
				<div className="h-25 w-25 rounded-lg border-2 border-theme-primary-100 dark:border-theme-secondary-800" />
				<div className="flex flex-col truncate">
					<span className="text-sm font-semibold text-theme-primary-100 dark:text-theme-secondary-800 truncate">
						{t("COMMON.AUTHOR")}
					</span>

					<div className="mt-1 text-lg font-bold text-theme-primary-100 dark:text-theme-secondary-800 truncate">
						{t("COMMON.EXCHANGE")}
					</div>
				</div>
			</div>
		</Card>
	);
};

export const ExchangeCard = ({ exchange, ...props }: ExchangeCardProps) => {
	if (exchange === undefined) {
		return <BlankExchangeCard />;
	}

	return <PluginCard plugin={exchange} showCategory={false} {...props} />;
};
