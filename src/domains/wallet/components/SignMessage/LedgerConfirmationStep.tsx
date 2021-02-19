import { Header } from "app/components/Header";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

export const LedgerConfirmationStep = ({ message }: { message: string }) => {
	const { t } = useTranslation();

	return (
		<>
			<Header title={t("WALLETS.MODAL_SIGN_MESSAGE.LEDGER_CONFIRMATION_STEP.TITLE")} />

			<LedgerConfirmation detailsHeading={null}>
				<TransactionDetail label={t("COMMON.MESSAGE")} padding={false} border={false}>
					<span className="break-all">{message}</span>
				</TransactionDetail>
			</LedgerConfirmation>
		</>
	);
};
