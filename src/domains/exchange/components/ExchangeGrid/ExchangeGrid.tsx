import React from "react";
import { useTranslation } from "react-i18next";

import { ExchangeCard } from "../ExchangeCard";

type ExchangeGridProps = {
	exchanges: any[];
	onClick: any;
	onDelete: any;
	onOpenDetails: any;
};

export const ExchangeGrid = ({ exchanges, onClick, onDelete, onOpenDetails }: ExchangeGridProps) => {
	const { t } = useTranslation();

	const actions = [
		{ label: t("COMMON.DETAILS"), value: "open-details" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	const handleExchangeAction = (exchange: any, action: any) => {
		switch (action?.value) {
			case "delete":
				onDelete(exchange);
				break;
			case "open-details":
				onOpenDetails(exchange);
				break;
		}
	};

	return (
		<div data-testid="ExchangeGrid" className="w-full grid grid-cols-3 gap-5">
			{exchanges.map((exchange: any, index: number) => (
				<ExchangeCard
					key={exchange?.id || `blank_${index}`}
					actions={actions}
					exchange={exchange}
					onClick={() => onClick(exchange)}
					onSelect={(action: any) => handleExchangeAction(exchange, action)}
				/>
			))}
		</div>
	);
};
