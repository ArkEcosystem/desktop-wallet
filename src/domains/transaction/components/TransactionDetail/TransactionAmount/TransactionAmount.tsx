import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Tippy from "@tippyjs/react";
import { Amount } from "app/components/Amount";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionAmountProps = {
	amount: BigNumber;
	convertedAmount?: BigNumber;
	currency: string;
	exchangeCurrency?: string;
	isMultiPayment: boolean;
	isSent: boolean;
};

export const TransactionAmount = ({
	amount,
	convertedAmount,
	currency,
	exchangeCurrency,
	isMultiPayment,
	isSent,
}: TransactionAmountProps) => {
	const { t } = useTranslation();

	const renderModeIcon = (isSent: boolean) => {
		const modeIconName = isSent ? "Sent" : "Received";
		const tooltipContent = t(`TRANSACTION.${modeIconName.toUpperCase()}`);

		const modeCircleStyle = isSent
			? "border-theme-danger-contrast text-theme-danger"
			: "border-theme-success-300 text-theme-success";

		return (
			<Tippy content={tooltipContent}>
				<Circle className={modeCircleStyle} size="lg">
					<Icon name={modeIconName} width={15} height={21} />
				</Circle>
			</Tippy>
		);
	};

	return (
		<TransactionDetail
			label={isMultiPayment ? t("TRANSACTION.TOTAL_AMOUNT") : t("TRANSACTION.AMOUNT")}
			extra={renderModeIcon(isSent)}
		>
			<Label color={isSent ? "danger" : "success"}>
				<Amount ticker={currency} value={amount} />
			</Label>
			{exchangeCurrency && convertedAmount && (
				<Amount ticker={exchangeCurrency} value={convertedAmount} className="ml-1 text-theme-neutral-light" />
			)}
		</TransactionDetail>
	);
};
