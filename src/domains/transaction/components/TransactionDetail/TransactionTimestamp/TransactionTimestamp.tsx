import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { useTimeFormat } from "app/hooks/use-time-format";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

interface TransactionTimestampProperties {
	timestamp: DateTime;
}

export const TransactionTimestamp = ({ timestamp }: TransactionTimestampProperties) => {
	const { t } = useTranslation();
	const format = useTimeFormat();

	return (
		<TransactionDetail data-testid="TransactionTimestamp" label={t("TRANSACTION.TIMESTAMP")}>
			{timestamp.format(format)}
		</TransactionDetail>
	);
};
