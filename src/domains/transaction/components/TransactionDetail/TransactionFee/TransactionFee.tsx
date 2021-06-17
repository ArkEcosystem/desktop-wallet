import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Amount } from "app/components/Amount";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProperties } from "../TransactionDetail";

type TransactionFeeProperties = {
	currency: string;
	value: BigNumber;
} & TransactionDetailProperties;

export const TransactionFee = ({ currency, value, ...properties }: TransactionFeeProperties) => {
	const { t } = useTranslation();

	return (
		<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")} {...properties}>
			<Amount ticker={currency} value={value} />
		</TransactionDetail>
	);
};

TransactionFee.defaultProps = {
	borderPosition: "top",
};
