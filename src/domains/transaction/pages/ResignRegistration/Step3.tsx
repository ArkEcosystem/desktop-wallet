import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import React from "react";
import { useTranslation } from "react-i18next";

import { PasswordType } from "./ResignRegistration.models";

export const ThirdStep = ({ form, passwordType }: { form: any; passwordType: PasswordType }) => {
	const { register } = form;

	const { t } = useTranslation();

	return (
		<div data-testid="ResignRegistration__third-step">
			{passwordType !== "ledger" && (
				<div>
					<h1 className="mb-0">{t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}</h1>
					<div className="text-theme-neutral-dark">{t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}</div>

					<div className="mt-8">
						<FormField name={passwordType}>
							<FormLabel>
								{passwordType === "mnemonic"
									? t("TRANSACTION.MNEMONIC")
									: t("TRANSACTION.ENCRYPTION_PASSWORD")}
							</FormLabel>
							<InputPassword
								data-testid={`ResignRegistration__${passwordType}`}
								name={passwordType}
								ref={register}
								onChange={() => form.clearErrors(passwordType)}
							/>
							<FormHelperText />
						</FormField>
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
