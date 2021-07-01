import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputPassword } from "app/components/Input";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useValidation } from "app/hooks";
import { toasts } from "app/services";
import { SettingsWrapper } from "domains/setting/components/SettingsPageWrapper";
import { useSettingsPrompt } from "domains/setting/hooks/use-settings-prompt";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Prompt } from "react-router-dom";

interface PasswordSettingsState {
	currentPassword: string;
	password: string;
	confirmPassword: string;
}

export const PasswordSettings = () => {
	const activeProfile = useActiveProfile();
	const { persist } = useEnvironmentContext();

	const usesPassword = activeProfile.usesPassword();
	const { password: passwordValidation } = useValidation();

	const { t } = useTranslation();

	const form = useForm<PasswordSettingsState>({
		defaultValues: {
			confirmPassword: "",
			currentPassword: "",
			password: "",
		},
		mode: "onChange",
	});

	const { formState, register, reset, trigger, watch } = form;
	const { currentPassword, confirmPassword, password } = watch();

	const { isDirty, dirtyFields, isValid } = formState;
	const { getPromptMessage } = useSettingsPrompt({ dirtyFields, isDirty });

	const handleSubmit = async ({ currentPassword, password }: PasswordSettingsState) => {
		try {
			if (usesPassword) {
				activeProfile.auth().changePassword(currentPassword, password);
			} else {
				activeProfile.auth().setPassword(password);
			}
		} catch {
			toasts.error(`${t("COMMON.ERROR")}: ${t("SETTINGS.PASSWORD.ERROR.MISMATCH")}`);
			return;
		}

		reset();

		// the profile has already been saved by the changePassword / setPassword methods above
		await persist();

		toasts.success(t("SETTINGS.PASSWORD.SUCCESS"));
	};

	return (
		<SettingsWrapper profile={activeProfile} activeSettings="password">
			<div className="space-y-8">
				<Header
					title={t("SETTINGS.PASSWORD.TITLE")}
					subtitle={
						usesPassword ? t("SETTINGS.PASSWORD.SUBTITLE.UPDATE") : t("SETTINGS.PASSWORD.SUBTITLE.CREATE")
					}
				/>

				<Form
					id="password-settings__form"
					context={form as any}
					onSubmit={handleSubmit as any}
					className="space-y-5"
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
						<Button data-testid="Password-settings__submit-button" disabled={!isValid} type="submit">
							{usesPassword ? t("SETTINGS.PASSWORD.BUTTON.UPDATE") : t("SETTINGS.PASSWORD.BUTTON.CREATE")}
						</Button>
					</div>
				</Form>

				<Prompt message={getPromptMessage} />
			</div>
		</SettingsWrapper>
	);
};
