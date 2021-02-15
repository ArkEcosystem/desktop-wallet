import { Header } from "app/components/Header";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

export const LedgerReviewMessage = ({ message }: { message: string }) => {
	const { t } = useTranslation();

	return (
		<>
			<Header
				title={t("TRANSACTION.LEDGER_CONFIRMATION.TITLE")}
				subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}
			/>

			<LedgerConfirmation hideSubtitle>
				<TransactionDetail label={t("COMMON.MESSAGE")} border={false}>
					<span className="break-all">{message}</span>
				</TransactionDetail>
			</LedgerConfirmation>
		</>
	);
};
