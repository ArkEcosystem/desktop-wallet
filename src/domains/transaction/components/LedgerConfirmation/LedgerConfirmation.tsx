import { images } from "app/assets/images";
import { Spinner } from "app/components/Spinner";
import React from "react";
import { useTranslation } from "react-i18next";

const { ConfirmTransactionLedgerBanner } = images.transaction.common;

export const LedgerConfirmation = () => {
	const { t } = useTranslation();

	return (
		<>
			<ConfirmTransactionLedgerBanner className="my-8" />
			<div className="mt-8 text-center text-theme-secondary-text" data-testid="LedgerConfirmation-description">
				{t("TRANSACTION.LEDGER_CONFIRMATION.DESCRIPTION")}
			</div>
			<div className="inline-flex items-center justify-center w-full mt-8 space-x-3">
				<Spinner color="primary" />
				<span className="font-semibold text-black" data-testid="LedgerConfirmation-loading_message">
					{t("TRANSACTION.LEDGER_CONFIRMATION.LOADING_MESSAGE")}
				</span>
			</div>
		</>
	);
};
