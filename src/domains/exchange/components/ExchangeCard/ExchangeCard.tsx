import { images } from "app/assets/images";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

type ExchangeCardProps = {
	exchange: any;
	isSelected?: boolean;
	onClick: any;
};

const ExchangeCardStyled = styled.div`
	${tw`relative h-32 flex flex-col border-2 rounded-lg cursor-pointer select-none hover:shadow-xl`}
`;

const ChangeNowLogo = images.exchange.components.AddExchange.ChangeNowLogo;

export const AddExchangeCard = ({ onAddExchange }: { onAddExchange: any }) => {
	const { t } = useTranslation();

	return (
		<ExchangeCardStyled
			data-testid="Exchange__add-exchange-card"
			className="col-span-2 border-theme-primary-100"
			onClick={onAddExchange}
		>
			<div className="flex items-center my-auto px-12 font-semibold text-theme-primary-600">
				<Icon name="Plus" className="p-4 bg-theme-primary-100 rounded-lg mr-4" />

				{t("EXCHANGE.ADD_EXCHANGE")}
			</div>
		</ExchangeCardStyled>
	);
};

export const BlankCard = () => {
	const { t } = useTranslation();

	return (
		<ExchangeCardStyled data-testid="Exchange__blank-card" className="border-theme-primary-100">
			<div className="flex items-center my-auto px-12 font-semibold text-theme-primary-100">
				<div className="w-12 h-12 border-2 border-theme-primary-100 rounded-lg mr-4" />

				{t("EXCHANGE.EXCHANGE_NAME")}
			</div>
		</ExchangeCardStyled>
	);
};

export const ExchangeCard = ({ exchange, isSelected, onClick }: ExchangeCardProps) => {
	const { t } = useTranslation();
	const options = [
		{ label: "Option 1", value: "1" },
		{ label: "Option 2", value: "2" },
		{ label: "Option 3", value: "4" },
		{ label: "Option 4", value: "4" },
	];

	return (
		<ExchangeCardStyled
			data-testid={`Exchange__exchange-card-${exchange.id}`}
			className={
				isSelected
					? "bg-theme-success-100 border-theme-success-300 hover:border-theme-success-100"
					: "border-theme-primary-100 hover:border-theme-background"
			}
			onClick={onClick}
		>
			<div className="my-auto px-12 font-semibold">
				<div className="flex items-center">
					<div className="absolute top-4 right-2 text-theme-primary-200">
						<Dropdown toggleIcon="Settings" options={options} />
					</div>

					<div className="mr-4">
						<ChangeNowLogo className="w-12 h-12" />
					</div>

					<div className="truncate">{exchange.name}</div>
				</div>
			</div>
		</ExchangeCardStyled>
	);
};
