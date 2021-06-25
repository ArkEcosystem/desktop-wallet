import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { useTransactionTypes } from "domains/transaction/hooks/use-transaction-types";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProperties } from "../TransactionDetail";

type TransactionSenderProperties = {
	type: string;
} & TransactionDetailProperties;

export const TransactionType = ({ type, ...properties }: TransactionSenderProperties) => {
	const { t } = useTranslation();

	const { getIcon, getLabel } = useTransactionTypes();

	return (
		<TransactionDetail
			label={t("TRANSACTION.TRANSACTION_TYPE")}
			extra={
				<Circle
					className="text-theme-text border-theme-text dark:text-theme-secondary-600 dark:border-theme-secondary-600"
					size="lg"
				>
					<Icon name={getIcon(type)} width={20} height={20} />
				</Circle>
			}
			{...properties}
		>
			{getLabel(type)}
		</TransactionDetail>
	);
};
