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
	const { encryptPassword } = useValidation();

	return (
		<section data-testid="EncryptPassword" className="space-y-8">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.ENCRYPT_PASSWORD_STEP.TITLE")}
				titleSuffix={<span className="text-theme-secondary-500 dark:text-theme-secondary-800">optional</span>}
			/>

			<Alert variant="warning">{t("WALLETS.PAGE_IMPORT_WALLET.ENCRYPT_PASSWORD_STEP.WARNING")}</Alert>

			<FormField name="encryptionPassword">
				<FormLabel
					label={t("WALLETS.PAGE_IMPORT_WALLET.ENCRYPT_PASSWORD_STEP.PASSWORD_LABEL")}
					required={false}
					optional
				/>
				<InputPassword
					ref={register(encryptPassword.password())}
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
					required={!!encryptionPassword}
					optional={!encryptionPassword}
				/>
				<InputPassword ref={register(encryptPassword.confirmPassword(watch("encryptionPassword")))} />
			</FormField>
		</section>
	);
};
