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
			<div className="flex items-center px-12 my-auto font-semibold text-theme-primary-600">
				<Icon name="Plus" className="p-4 mr-4 rounded-lg bg-theme-primary-100" />

				{t("EXCHANGE.ADD_EXCHANGE")}
			</div>
		</ExchangeCardStyled>
	);
};

export const BlankCard = () => {
	const { t } = useTranslation();

	return (
		<ExchangeCardStyled data-testid="Exchange__blank-card" className="border-theme-primary-100">
			<div className="flex items-center px-12 my-auto font-semibold text-theme-primary-100">
				<div className="w-12 h-12 mr-4 border-2 rounded-lg border-theme-primary-100" />

				{t("EXCHANGE.EXCHANGE_NAME")}
			</div>
		</ExchangeCardStyled>
	);
};

export const ExchangeCard = ({ exchange, isSelected, onClick }: ExchangeCardProps) => {
	const { t } = useTranslation();
	const options = [{ label: "Option 1", value: "1" }];

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
			<div className="px-12 my-auto font-semibold">
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
