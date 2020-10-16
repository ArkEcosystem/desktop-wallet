import { images } from "app/assets/images";
import { Header } from "app/components/Header";
import { Page, Section } from "app/components/Layout";
import { Slider } from "app/components/Slider";
import { useActiveProfile } from "app/hooks";
import { AddExchange } from "domains/exchange/components/AddExchange";
import { AddExchangeCard, BlankExchangeCard, ExchangeCard } from "domains/exchange/components/ExchangeCard";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type ExchangeProps = {
	exchanges: any[];
};

const ExchangeCardsBanner = images.exchange.pages.Exchange.ExchangeCardsBanner;
const NoExchangesBanner = images.exchange.pages.Exchange.NoExchangesBanner;

const NoExchangesList = ({ onAddExchange }: { onAddExchange: any }) => {
	const { t } = useTranslation();

	return (
		<div className="grid grid-cols-8 mt-8">
			<div className="flex flex-col h-32 col-span-6 mr-5 border-2 rounded-lg border-theme-primary-contrast">
				<div className="flex flex-col m-auto text-center">
					<span className="font-semibold">{t("EXCHANGE.YOUR_EXCHANGE_LIST")}</span>

					<span className="m-auto text-sm text-theme-neutral">{t("EXCHANGE.NO_EXCHANGES_MESSAGE")}</span>
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
		<div className="mt-8">
			<Slider
				data={sliderGridData(exchanges)}
				options={sliderOptions}
				paginationPosition="top-right"
				className="grid grid-cols-8 gap-4"
			>
				{(exchange: any) => {
					if (exchange.isNew) {
						return <AddExchangeCard onAddExchange={onAddExchange} />;
					}

					if (exchange.isBlank) {
						return <BlankExchangeCard />;
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

export const Exchange = ({ exchanges }: ExchangeProps) => {
	const activeProfile = useActiveProfile();

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [selectedExchange, setSelectedExchange] = useState(null);

	const { t } = useTranslation();

	return (
		<>
			<Page profile={activeProfile} data-testid="Exchange">
				<Section>
					<Header title={t("EXCHANGE.TITLE")} subtitle={t("EXCHANGE.DESCRIPTION")} />

					{exchanges.length ? (
						<ExchangesList
							exchanges={exchanges}
							selectedExchange={selectedExchange}
							onAddExchange={() => setModalIsOpen(true)}
							onSelect={(exchange: any) => setSelectedExchange(exchange)}
						/>
					) : (
						<NoExchangesList onAddExchange={() => setModalIsOpen(true)} />
					)}
				</Section>

				<Section className="flex-1">
					{exchanges.length ? (
						<div className="text-center">
							<ExchangeCardsBanner className="mx-auto" />

							<div className="mt-8 text-theme-neutral-dark">{t("EXCHANGE.SELECT_EXCHANGE_MESSAGE")}</div>
						</div>
					) : (
						<NoExchangesBanner className="mx-auto" />
					)}
				</Section>
			</Page>

			<AddExchange isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
		</>
	);
};

Exchange.defaultProps = {
	exchanges: [],
};
