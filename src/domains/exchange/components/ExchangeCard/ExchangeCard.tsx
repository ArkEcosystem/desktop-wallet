import { Image } from "app/components/Image";
import { Card } from "app/components/Card";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

type ExchangeCardProps = {
	exchange: any;
	isSelected?: boolean;
	onClick: any;
};

export const AddExchangeCard = ({ onAddExchange }: { onAddExchange: any }) => {
	const { t } = useTranslation();

	return (
		<Card className="flex col-span-2" onClick={onAddExchange}>
			<div className="flex items-center p-2 font-semibold text-theme-primary">
				<Icon name="Plus" className="p-4 mr-4 rounded-lg bg-theme-primary-contrast" />

				{t("EXCHANGE.ADD_EXCHANGE")}
			</div>
		</Card>
	);
};

export const BlankExchangeCard = () => {
	const { t } = useTranslation();

	return (
		<Card>
			<div className="flex items-center p-2 font-semibold text-theme-primary-contrast">
				<div className="w-12 h-12 mr-4 border-2 rounded-lg border-theme-primary-contrast" />

				{t("EXCHANGE.EXCHANGE_NAME")}
			</div>
		</Card>
	);
};

export const ExchangeCard = ({ exchange, isSelected, onClick }: ExchangeCardProps) => {
	const options = [{ label: "Option 1", value: "1" }];

	return (
		<Card isSelected={isSelected} onClick={onClick} actions={options}>
			<div className="flex items-center p-2 font-semibold text-theme-primary">
				<div className="mr-4">
					<div className="w-12 h-12">
						<Image name="ChangeNowLogo" domain="exchange" />
					</div>
				</div>

				<div className="truncate">{exchange.name}</div>
			</div>
		</Card>
	);
};
