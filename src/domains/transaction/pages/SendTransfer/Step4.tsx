import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import React from "react";
import { useTranslation } from "react-i18next";

export const FourthStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="SendTransfer__step--fourth">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.LEDGER_CONFIRMATION.TITLE")}</h1>
				<LedgerConfirmation />
			</div>
		</section>
	);
};
