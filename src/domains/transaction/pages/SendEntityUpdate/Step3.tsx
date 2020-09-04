import { FormField, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import React from "react";
import { useTranslation } from "react-i18next";

export const ThirdStep = ({ form, passwordType }: { form: any; passwordType: "mnemonic" | "password" | "ledger" }) => {
	const { register } = form;

	const { t } = useTranslation();

	return (
		<div data-testid="SendEntityUpdate__third-step">
			{passwordType !== "ledger" && (
				<div>
					<h1 className="mb-0">{t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}</h1>
					<div className="text-theme-neutral-dark">{t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}</div>

					<div className="mt-8">
						<FormField name="name">
							<FormLabel>
								{passwordType === "mnemonic"
									? t("TRANSACTION.MNEMONIC")
									: t("TRANSACTION.ENCRYPTION_PASSWORD")}
							</FormLabel>
							<InputPassword name={passwordType} ref={register} />
						</FormField>

						{passwordType === "mnemonic" && (
							<FormField name="name" className="mt-8">
								<FormLabel>{t("TRANSACTION.SECOND_MNEMONIC")}</FormLabel>
								<InputPassword name="secondMnemonic" ref={register} />
							</FormField>
						)}
					</div>
				</div>
			)}

			{passwordType === "ledger" && (
				<div>
					<h1>{t("TRANSACTION.LEDGER_CONFIRMATION.TITLE")}</h1>
					<LedgerConfirmation />
				</div>
			)}
		</div>
	);
};
