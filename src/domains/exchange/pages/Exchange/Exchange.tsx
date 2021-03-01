import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
import { AddExchange } from "domains/exchange/components/AddExchange";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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

// export const Exchange = ({ exchanges }: ExchangeProps) => {
export const Exchange = () => {
	const activeProfile = useActiveProfile();

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [selectedExchange, setSelectedExchange] = useState(null);

	const { t } = useTranslation();

	// @TODO replace test data with profile data
	const exchanges = [
		{
			id: "changenow-plugin",
			name: "ChangeNOW Plugin",
			logo: "https://raw.githubusercontent.com/ChangeNow-io/ARKPlugin/master/logo.png",
		},
		{
			id: "binance",
			name: "Coinbase Pro",
			author: "Coinbase",
		},
	];

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
						extra={<ExchangeHeaderExtra onAddExchange={() => setModalIsOpen(true)} />}
					/>
				</Section>

				<Section>
					<ExchangeGrid exchanges={exchanges} />
				</Section>
			</Page>

			<AddExchange isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
		</>
	);
};
