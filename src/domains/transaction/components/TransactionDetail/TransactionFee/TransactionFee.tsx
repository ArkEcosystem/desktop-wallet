import { AmountCrypto } from "app/components/Amount";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProperties } from "../TransactionDetail";

type TransactionFeeProperties = {
	currency: string;
	value: number;
} & TransactionDetailProperties;

const TransactionFee: React.FC<TransactionFeeProperties> = ({
	currency,
	value,
	...properties
}: TransactionFeeProperties) => {
	const { t } = useTranslation();

	return (
		<TransactionDetail data-testid="TransactionFee" label={t("TRANSACTION.TRANSACTION_FEE")} {...properties}>
			<AmountCrypto ticker={currency} value={value} />
		</TransactionDetail>
	);
};

TransactionFee.defaultProps = {
	borderPosition: "top",
};

export { TransactionFee };
