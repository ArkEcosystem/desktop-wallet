import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputPassword } from "app/components/Input";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useValidation } from "app/hooks";
import React from "react";
import { useTranslation } from "react-i18next";

import { SettingsProps } from "../Settings.models";

export const PasswordSettings = ({ formConfig, onSuccess, onError }: SettingsProps) => {
	const activeProfile = useActiveProfile();
	const { env } = useEnvironmentContext();

	const usesPassword = activeProfile.usesPassword();
	const { settings } = useValidation();

	const { t } = useTranslation();

	const { formState, register, reset, trigger, watch } = formConfig.context;
	const { confirmPassword, password } = watch();

	const handleSubmit = async ({ currentPassword, password }: any) => {
		try {
			if (usesPassword) {
				activeProfile.auth().changePassword(currentPassword, password);
			} else {
				activeProfile.auth().setPassword(password);
			}
		} catch (error) {
			return onError(t("SETTINGS.PASSWORD.ERROR.MISMATCH"));
		}

		reset();

		// the profile has already been saved by the changePassword / setPassword methods above
		await env.persist();

		onSuccess(t("SETTINGS.PASSWORD.SUCCESS"));
	};

	return (
		<div className="space-y-8">
			<Header
				title={t("SETTINGS.PASSWORD.TITLE")}
				subtitle={
					usesPassword ? t("SETTINGS.PASSWORD.SUBTITLE_UPDATE") : t("SETTINGS.PASSWORD.SUBTITLE_CREATE")
				}
			/>

			<Form
				id="password-settings__form"
				context={formConfig.context}
				onSubmit={handleSubmit}
				className="space-y-8"
			>
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
						ref={register(settings.password())}
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
						ref={register(settings.confirmPassword(password))}
						data-testid={`Password-settings__input--password_2`}
					/>
				</FormField>

				<div className="flex justify-end mt-8 w-full">
					<Button data-testid="Password-settings__submit-button" disabled={!formState.isValid} type="submit">
						{usesPassword ? t("SETTINGS.PASSWORD.BUTTON.UPDATE") : t("SETTINGS.PASSWORD.BUTTON.CREATE")}
					</Button>
				</div>
			</Form>
		</div>
	);
};
