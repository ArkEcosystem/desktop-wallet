
import { images } from "app/assets/images";
import { Slider } from "app/components/Slider";
import { AddExchange } from "domains/exchange/components/AddExchange";
import { AddExchangeCard, BlankCard, ExchangeCard } from "domains/exchange/components/ExchangeCard";
import React from "react";
import { useTranslation } from "react-i18next";

type ExchangeProps = {
	exchanges?: any[];
};

const ExchangeCardsBanner = images.exchange.pages.Exchange.ExchangeCardsBanner;
const NoExchangesBanner = images.exchange.pages.Exchange.NoExchangesBanner;

const NoExchangesList = ({ onAddExchange }: { onAddExchange }) => {
	const { t } = useTranslation();

	return (
		<div className="grid grid-cols-8 gap-4 mt-8 mb-16">
			<div className="flex flex-col col-span-6 border-2 border-theme-primary-100 rounded-lg h-32">
				<div className="flex flex-col text-center m-auto">
					<span className="font-semibold">{t("EXCHANGE.YOUR_EXCHANGE_LIST")}</span>

					<span className="text-theme-neutral-500 text-sm m-auto">{t("EXCHANGE.NO_EXCHANGES_MESSAGE")}</span>
				</div>
			</div>

			<AddExchangeCard onAddExchange={onAddExchange} />
		</div>
	);
};

const ExchangesList = ({
	exchanges,
	onAddExchange,
	onSelect,
	selectedExchange,
}: {
	exchanges: any[];
	onAddExchange: any;
	onSelect: any;
	selectedExchange: any;
}) => {
	const sliderOptions = {
		slideHeight: 155, // Wallet card height, including margin-bottom
		slidesPerView: 4,
		slidesPerColumn: 1,
		slidesPerGroup: 4,
		slidesPerView: 4,
		spaceBetween: 20,
	};

	const sliderGridData = (exchanges: any) => {
		const blankRemainder = ((exchanges.length as number) + 1) % sliderOptions.slidesPerView;
		if (blankRemainder > 0) {
			const blankLength = Math.abs(sliderOptions.slidesPerView - blankRemainder);
			const blankCards = new Array(blankLength).fill({ isBlank: true });

			return [...exchanges, { isNew: true }, ...blankCards];
		}

		return [...exchanges, { isNew: true }];
	};

	return (
		<div className="mt-8 mb-16">
			<Slider
				data={sliderGridData(exchanges)}
				options={sliderOptions}
				paginationPosition="top-right"
				className="grid grid-cols-8 gap-4"
			>
				{(exchange: any) => {
					if (exchange.isNew) {
						return <AddExchangeCard onAddExchange={onAddExchange} />;
					} else if (exchange.isBlank) {
						return <BlankCard />;
					}

					return (
						<ExchangeCard
							exchange={exchange}
							isSelected={selectedExchange?.id === exchange.id}
							onClick={() => onSelect(exchange)}
						/>
					);
				}}
			</Slider>
		</div>
	);
};

export const Exchange = (props: ExchangeProps) => {
	const { t } = useTranslation();
	const [modalIsOpen, setModalIsOpen] = React.useState(false);
	const [selectedExchange, setSelectedExchange] = React.useState(null);

	return (
		<div data-testid="Exchange">
			<AddExchange isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />

			<div className="border-t-20 border-theme-neutral-100">
				<div className="container mx-auto mt-10">
					<h1>{t("EXCHANGE.TITLE")}</h1>
					<div className="text-theme-neutral-700">{t("EXCHANGE.DESCRIPTION")}</div>

					{props.exchanges.length ? (
						<ExchangesList
							exchanges={props.exchanges}
							selectedExchange={selectedExchange}
							onAddExchange={() => setModalIsOpen(true)}
							onSelect={(exchange) => setSelectedExchange(exchange)}
						/>
					) : (
						<NoExchangesList onAddExchange={() => setModalIsOpen(true)} />
					)}
				</div>
			</div>

			<div className="border-t-20 border-theme-neutral-100">
				{props.exchanges.length ? (
					<div className="text-center">
						<ExchangeCardsBanner className="mx-auto mt-20" />

						<div className="mt-6 text-theme-neutral-700">{t("EXCHANGE.SELECT_EXCHANGE_MESSAGE")}</div>
					</div>
				) : (
					<NoExchangesBanner className="mx-auto mt-16" />
				)}
			</div>
		</div>
	);
};

Exchange.defaultProps = {
	exchanges: [],
};
