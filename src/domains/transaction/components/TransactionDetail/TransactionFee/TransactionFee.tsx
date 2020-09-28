import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Amount } from "app/components/Amount";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionFeeProps = {
	currency: string;
	value: BigNumber;
};

export const TransactionFee = ({ currency, value }: TransactionFeeProps) => {
	const { t } = useTranslation();

	return (
		<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>
			<Amount ticker={currency} value={value} />
		</TransactionDetail>
	);
};
