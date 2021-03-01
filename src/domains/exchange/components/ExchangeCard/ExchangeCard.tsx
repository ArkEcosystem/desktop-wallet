import { Card } from "app/components/Card";
import { DropdownOption } from "app/components/Dropdown";
import React from "react";
import { useTranslation } from "react-i18next";

import { ExchangeImage } from "../ExchangeImage";

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
				<div className="flex flex-col space-y-1 truncate">
					<span className="text-sm font-semibold text-theme-primary-100 dark:text-theme-secondary-800 truncate">
						{t("COMMON.AUTHOR")}
					</span>

					<div className="text-lg font-bold text-theme-primary-100 dark:text-theme-secondary-800 truncate">
						{t("COMMON.EXCHANGE")}
					</div>
				</div>
			</div>
		</Card>
	);
};

export const ExchangeCard = ({ exchange, actions, onClick, onSelect }: ExchangeCardProps) => {
	if (exchange === undefined) {
		return <BlankExchangeCard />;
	}

	return (
		<Card actions={actions} onClick={onClick} onSelect={onSelect}>
			<div className="flex items-center space-x-4">
				<div className="min-w-25 w-25 h-25 overflow-hidden rounded-lg">
					<ExchangeImage logoURL={exchange.logo} />
				</div>

				<div className="flex flex-col space-y-1 truncate">
					<span className="text-sm font-semibold truncate text-theme-secondary-500 dark:text-theme-secondary-700">
						{exchange.author}
					</span>

					<div className="text-lg font-bold truncate text-theme-primary-600 dark:text-theme-secondary-200">
						{exchange.name}
					</div>
				</div>
			</div>
		</Card>
	);
};
