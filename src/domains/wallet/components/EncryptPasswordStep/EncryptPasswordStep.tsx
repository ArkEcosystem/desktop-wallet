import { Alert } from "app/components/Alert";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputPassword } from "app/components/Input";
import { useValidation } from "app/hooks";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const EncryptPasswordStep = () => {
	const { t } = useTranslation();
	const { register, watch, trigger } = useFormContext();
	const { encryptionPassword, confirmEncryptionPassword } = watch();
	const { password } = useValidation();

	return (
		<section data-testid="EncryptPassword">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.ENCRYPT_PASSWORD_STEP.TITLE")}
				titleSuffix={
					<span className="text-theme-secondary-500 dark:text-theme-secondary-800">
						{t("COMMON.OPTIONAL")}
					</span>
				}
			/>

			<Alert className="mt-6" variant="warning">{t("WALLETS.PAGE_IMPORT_WALLET.ENCRYPT_PASSWORD_STEP.WARNING")}</Alert>

			<div className="pt-6 space-y-6">
				<FormField name="encryptionPassword">
					<FormLabel label={t("WALLETS.PAGE_IMPORT_WALLET.ENCRYPT_PASSWORD_STEP.PASSWORD_LABEL")} optional />
					<InputPassword
						ref={register(password.password())}
						onChange={() => {
							if (confirmEncryptionPassword) {
								trigger("confirmEncryptionPassword");
							}
						}}
					/>
				</FormField>

				<FormField name="confirmEncryptionPassword">
					<FormLabel
						label={t("WALLETS.PAGE_IMPORT_WALLET.ENCRYPT_PASSWORD_STEP.CONFIRM_PASSWORD_LABEL")}
						optional={!encryptionPassword}
					/>
					<InputPassword ref={register(password.confirmPassword(watch("encryptionPassword")))} />
				</FormField>
			</div>
		</section>
	);
};
