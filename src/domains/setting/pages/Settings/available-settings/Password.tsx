import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputPassword } from "app/components/Input";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useReloadPath,useValidation } from "app/hooks";
import { toasts } from "app/services";
import { useSettingsPrompt } from "domains/setting/hooks/use-settings-prompt";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Prompt } from "react-router-dom";

export const PasswordSettings = () => {
	const reloadPath = useReloadPath();
	const activeProfile = useActiveProfile();
	const { persist } = useEnvironmentContext();

	const usesPassword = activeProfile.usesPassword();
	const { password: passwordValidation } = useValidation();

	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { formState, register, reset, trigger, watch } = form;
	const { currentPassword, confirmPassword, password } = watch();
	const { getPromptMessage } = useSettingsPrompt({ isDirty: formState.isDirty });

	const handleSubmit = async ({ currentPassword, password }: any) => {
		try {
			if (usesPassword) {
				activeProfile.auth().changePassword(currentPassword, password);
			} else {
				activeProfile.auth().setPassword(password);
			}
		} catch {
			toasts.error("SETTINGS.PASSWORD.ERROR.MISMATCH");
		}

		reset();

		// the profile has already been saved by the changePassword / setPassword methods above
		await persist();

		reloadPath();
		toasts.success("SETTINGS.PASSWORD.SUCCESS");
	};

	return (
		<div className="space-y-8">
			<Header
				title={t("SETTINGS.PASSWORD.TITLE")}
				subtitle={
					usesPassword ? t("SETTINGS.PASSWORD.SUBTITLE.UPDATE") : t("SETTINGS.PASSWORD.SUBTITLE.CREATE")
				}
			/>

			<Form id="password-settings__form" context={form} onSubmit={handleSubmit} className="space-y-5">
				{usesPassword && (
					<FormField name="currentPassword">
						<FormLabel label={t("SETTINGS.PASSWORD.CURRENT")} />
						<InputPassword
							ref={register({
								required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
									field: t("SETTINGS.PASSWORD.CURRENT"),
								}).toString(),
							})}
							data-testid="Password-settings__input--currentPassword"
						/>
					</FormField>
				)}

				<FormField name="password">
					<FormLabel label={t("SETTINGS.PASSWORD.PASSWORD_1")} />
					<InputPassword
						ref={register(passwordValidation.password(currentPassword))}
						onChange={() => {
							if (confirmPassword) {
								trigger("confirmPassword");
							}
						}}
						data-testid={`Password-settings__input--password_1`}
					/>
				</FormField>

				<FormField name="confirmPassword">
					<FormLabel label={t("SETTINGS.PASSWORD.PASSWORD_2")} />
					<InputPassword
						ref={register(passwordValidation.confirmPassword(password))}
						data-testid={`Password-settings__input--password_2`}
					/>
				</FormField>

				<div className="flex justify-end mt-8 w-full">
					<Button data-testid="Password-settings__submit-button" disabled={!formState.isValid} type="submit">
						{usesPassword ? t("SETTINGS.PASSWORD.BUTTON.UPDATE") : t("SETTINGS.PASSWORD.BUTTON.CREATE")}
					</Button>
				</div>
			</Form>

			<Prompt message={getPromptMessage} />
		</div>
	);
};
