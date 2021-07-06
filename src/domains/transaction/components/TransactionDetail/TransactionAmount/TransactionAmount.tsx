import { Amount, AmountCrypto } from "app/components/Amount";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProperties } from "../TransactionDetail";

type TransactionAmountProperties = {
	amount: number;
	convertedAmount?: number;
	currency: string;
	exchangeCurrency?: string;
	isMultiPayment?: boolean;
	isSent: boolean;
} & TransactionDetailProperties;

export const TransactionAmount: React.FC<TransactionAmountProperties> = ({
	amount,
	convertedAmount,
	currency,
	exchangeCurrency,
	isMultiPayment,
	isSent,
	...properties
}: TransactionAmountProperties) => {
	const { t } = useTranslation();

	const renderModeIcon = (isSent: boolean) => {
		const modeIconName = isSent ? "Sent" : "Received";
		const tooltipContent = t(`TRANSACTION.${modeIconName.toUpperCase()}`);

		const modeCircleStyle = isSent
			? "border-theme-danger-100 text-theme-danger-500 dark:border-theme-danger-400 dark:text-theme-danger-400"
			: "border-theme-success-300 text-theme-success-600 dark:border-theme-success-600";

		return (
			<Tooltip content={tooltipContent}>
				<Circle className={modeCircleStyle} size="lg">
					<Icon name={modeIconName} />
				</Circle>
			</Tooltip>
		);
	};

	return (
		<TransactionDetail
			data-testid="TransactionAmount"
			label={isMultiPayment ? t("TRANSACTION.TOTAL_AMOUNT") : t("TRANSACTION.AMOUNT")}
			extra={renderModeIcon(isSent)}
			{...properties}
		>
			<Label color={isSent ? "danger" : "success"}>
				<AmountCrypto showSign ticker={currency} value={amount} isNegative={isSent} />
			</Label>

			{!!exchangeCurrency && !!convertedAmount && (
				<Amount ticker={exchangeCurrency} value={convertedAmount} className="ml-2 text-theme-secondary-400" />
			)}
		</TransactionDetail>
	);
};
