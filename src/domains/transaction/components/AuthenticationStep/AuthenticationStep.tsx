import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputPassword } from "app/components/Input";
import { useValidation } from "app/hooks/validations";
import { LedgerConfirmation } from "domains/transaction/components/LedgerConfirmation";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const AuthenticationStep = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	const isLedger = wallet.isLedger();

	const { authentication } = useValidation();

	if (isLedger) {
		return (
			<div data-testid="AuthenticationStep" className="space-y-8">
				<Header
					title={t("TRANSACTION.LEDGER_CONFIRMATION.TITLE")}
					subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}
				/>

				<LedgerConfirmation />
			</div>
		);
	}

	return (
		<div data-testid="AuthenticationStep" className="space-y-8">
			<Header
				title={t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}
				subtitle={t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}
			/>

			<FormField name="mnemonic">
				<FormLabel>{t("TRANSACTION.MNEMONIC")}</FormLabel>
				<InputPassword data-testid="AuthenticationStep__mnemonic" ref={register(authentication.mnemonic())} />
				<FormHelperText />
			</FormField>

			{wallet.isSecondSignature() && (
				<FormField name="secondMnemonic">
					<FormLabel>{t("TRANSACTION.SECOND_MNEMONIC")}</FormLabel>
					<InputPassword
						data-testid="AuthenticationStep__second-mnemonic"
						ref={register(authentication.secondMnemonic())}
					/>
					<FormHelperText />
				</FormField>
			)}
		</div>
	);
};
