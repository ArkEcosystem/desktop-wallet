import { DateTime } from "@arkecosystem/platform-sdk-intl";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionTimestampProps = {
	format: string;
	timestamp: DateTime;
};

export const TransactionTimestamp = ({ format, timestamp }: TransactionTimestampProps) => {
	const { t } = useTranslation();

	return <TransactionDetail label={t("TRANSACTION.TIMESTAMP")}>{timestamp.format(format)}</TransactionDetail>;
};

TransactionTimestamp.defaultProps = {
	format: "DD.MM.YYYY HH:mm:ss",
};
