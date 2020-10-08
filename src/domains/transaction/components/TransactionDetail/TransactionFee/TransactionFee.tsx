import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Amount } from "app/components/Amount";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProps } from "../TransactionDetail";

type TransactionFeeProps = {
	currency: string;
	value: BigNumber;
} & TransactionDetailProps;

export const TransactionFee = ({ currency, value, ...props }: TransactionFeeProps) => {
	const { t } = useTranslation();

	return (
		<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")} {...props}>
			<Amount ticker={currency} value={value} />
		</TransactionDetail>
	);
};

TransactionFee.defaultProps = {
	borderPosition: "top",
};
