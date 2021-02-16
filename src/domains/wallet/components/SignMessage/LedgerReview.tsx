import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const LedgerReview = () => {
	const { getValues, watch } = useFormContext();

	// getValues does not get the value of `defaultValues` on first render
	const [watched] = useState(() => watch());
	const message = getValues("message") || watched.message;

	const { t } = useTranslation();

	return (
		<LedgerConfirmation detailsHeading={null}>
			<TransactionDetail label={t("COMMON.MESSAGE")} padding={false} border={false}>
				<span className="break-all">{message}</span>
			</TransactionDetail>
		</LedgerConfirmation>
	);
};
