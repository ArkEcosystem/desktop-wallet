import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const AuthenticationStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	const isLedger = wallet.isLedger();

	return (
		<div data-testid="AuthenticationStep">
			{!isLedger && (
				<div>
					<h1 className="mb-0">{t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}</h1>
					<div className="text-theme-neutral-dark">{t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}</div>
					<div className="mt-8">
						<FormField name="mnemonic">
							<FormLabel>{t("TRANSACTION.MNEMONIC")}</FormLabel>
							<InputPassword data-testid="AuthenticationStep__mnemonic" ref={register} />
							<FormHelperText />
						</FormField>

						{wallet.isSecondSignature() && (
							<FormField name="secondMnemonic" className="mt-8">
								<FormLabel>{t("TRANSACTION.SECOND_MNEMONIC")}</FormLabel>
								<InputPassword data-testid="AuthenticationStep__second-mnemonic" ref={register} />
								<FormHelperText />
							</FormField>
						)}
					</div>
				</div>
			)}

			{isLedger && (
				<div>
					<h1>{t("TRANSACTION.LEDGER_CONFIRMATION.TITLE")}</h1>
					<LedgerConfirmation />
				</div>
			)}
		</div>
	);
};
