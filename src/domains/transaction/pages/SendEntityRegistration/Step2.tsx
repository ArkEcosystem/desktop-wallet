import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SecondStep = ({
	passwordType,
	wallet,
}: {
	passwordType: "mnemonic" | "password" | "ledger";
	wallet: ReadWriteWallet;
}) => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<div data-testid="Registration__signing-step">
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
							<InputPassword ref={register} />
							<FormHelperText />
						</FormField>

						{wallet.isSecondSignature() && (
							<FormField name="secondMnemonic" className="mt-8">
								<FormLabel>{t("TRANSACTION.SECOND_MNEMONIC")}</FormLabel>
								<InputPassword ref={register} />
								<FormHelperText />
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
