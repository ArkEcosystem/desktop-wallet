import React from "react";
import { useTranslation } from "react-i18next";

import { ExchangeCard } from "../ExchangeCard";

type ExchangeGridProps = {
	exchanges: any[];
};

export const ExchangeGrid = ({ exchanges }: ExchangeGridProps) => {
	const { t } = useTranslation();

	const actions = [
		{ label: t("COMMON.LAUNCH"), value: "launch" },
		{ label: t("COMMON.REPORT"), value: "report" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	const handleExchangeAction = (exchange: any, action: any) => {
		switch (action?.value) {
			case "launch":
				// @TODO report exchange
				break;
			case "report":
				// @TODO report exchange
				break;
			case "delete":
				// @TODO delete exchange
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
					onClick={() => handleExchangeAction(exchange, "launch")}
					onSelect={(action: any) => handleExchangeAction(exchange, action)}
				/>
			))}
		</div>
	);
};
