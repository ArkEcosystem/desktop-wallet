import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputPassword } from "app/components/Input";
import { useActiveProfile } from "app/hooks/env";
import React from "react";
import { useTranslation } from "react-i18next";

type SettingsProps = {
	env: Environment;
	formConfig: any;
	onSubmit: (profile: Profile) => void;
};

export const PasswordSettings = ({ env, formConfig, onSubmit }: SettingsProps) => {
	const activeProfile = useActiveProfile();
	const usesPassword = activeProfile.usesPassword();

	const { t } = useTranslation();

	const minLength = 6;

	const { formState, register, reset, watch } = formConfig.context;

	const handleSubmit = async ({ currentPassword, newPassword, newPasswordConfirmation }: any) => {
		try {
			if (usesPassword) {
				activeProfile.auth().changePassword(currentPassword, newPassword);
			} else {
				activeProfile.auth().setPassword(newPassword);
			}

			reset();

			await env.persist();

			onSubmit(activeProfile);

			// TODO handle success
		} catch (error) {
			// TODO show error toast
			console.log(error);
		}
	};

	return (
		<>
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
				className="mt-8 space-y-8"
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
						/>
						<FormHelperText />
					</FormField>
				)}

				<FormField name="newPassword">
					<FormLabel label={t("SETTINGS.PASSWORD.NEW")} />
					<InputPassword
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("SETTINGS.PASSWORD.NEW"),
							}).toString(),
							minLength: {
								value: minLength,
								message: t("COMMON.VALIDATION.MIN_LENGTH", {
									field: t("SETTINGS.PASSWORD.NEW"),
									minLength,
								}),
							},
						})}
					/>
					<FormHelperText />
				</FormField>

				<FormField name="newPasswordConfirmation">
					<FormLabel label={t("SETTINGS.PASSWORD.CONFIRMATION")} />
					<InputPassword
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("SETTINGS.PASSWORD.CONFIRMATION"),
							}).toString(),
							validate: {
								equals: (confirmation: string) => confirmation === watch("newPassword"),
							},
						})}
					/>
					<FormHelperText
						errorMessage={t("COMMON.VALIDATION.SUBJECT_MISMATCH", {
							subject: t("COMMON.PASSWORDS"),
						}).toString()}
					/>
				</FormField>

				<div className="flex justify-end w-full mt-8">
					<Button disabled={!formState.isValid} type="submit">
						{usesPassword ? t("SETTINGS.PASSWORD.BUTTON.UPDATE") : t("SETTINGS.PASSWORD.BUTTON.CREATE")}
					</Button>
				</div>
			</Form>
		</>
	);
};
