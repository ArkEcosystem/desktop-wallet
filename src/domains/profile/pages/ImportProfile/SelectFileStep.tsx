import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import React from "react";
import { useTranslation } from "react-i18next";

export const SelectFileStep = ({ onBack }: { onBack?: () => void }) => {
	const { t } = useTranslation();

	return (
		<div className="mx-auto max-w-xl">
			<Header
				title={t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.DESCRIPTION")}
			/>

			<div className="flex justify-end mt-10 space-x-3">
				<Button data-testid="SendTransfer__button--back" variant="secondary" onClick={onBack}>
					{t("COMMON.BACK")}
				</Button>
			</div>
		</div>
	);
};
