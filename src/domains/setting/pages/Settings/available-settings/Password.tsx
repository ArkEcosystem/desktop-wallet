import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputPassword } from "app/components/Input";
import { useActiveProfile } from "app/hooks/env";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type SettingsProps = {
	env: Environment;
	formConfig: any;
	onSubmit: (profile: Profile) => void;
};

export const PasswordSettings = ({ env, formConfig, onSubmit }: SettingsProps) => {
	const [status, setStatus] = useState<Record<string, string> | null>(null);

	const activeProfile = useActiveProfile();
	const usesPassword = activeProfile.usesPassword();

	const { t } = useTranslation();

	const minLength = 6;

	const { formState, register, reset, watch } = formConfig.context;

	const formatError = (errorMessage: string) => {
		if (errorMessage === "The current password does not match.") {
			return t("SETTINGS.PASSWORD.ERROR.MISMATCH");
		}

		return t("SETTINGS.PASSWORD.ERROR.FALLBACK");
	};

	const handleSubmit = async ({ currentPassword, newPassword, newPasswordConfirmation }: any) => {
		try {
			if (usesPassword) {
				activeProfile.auth().changePassword(currentPassword, newPassword);
			} else {
				activeProfile.auth().setPassword(newPassword);
			}
		} catch (error) {
			return setStatus({ type: "error", message: formatError(error.message) });
		}

		reset();

		setStatus({ type: "success", message: t("SETTINGS.PASSWORD.SUCCESS") });

		await env.persist();

		onSubmit(activeProfile);
	};

	return (
		<div className="space-y-8">
			<Header
				title={t("SETTINGS.PASSWORD.TITLE")}
				subtitle={
					usesPassword ? t("SETTINGS.PASSWORD.SUBTITLE_UPDATE") : t("SETTINGS.PASSWORD.SUBTITLE_CREATE")
				}
			/>

			{status && (
				<div className="mb-8" data-testid="Password__error-alert">
					{status.type === "error" ? (
						<Alert variant="danger" size="sm" title={t("COMMON.ERROR")}>
							{status.message}
						</Alert>
					) : (
						<Alert variant="success" size="sm" title={t("COMMON.SUCCESS")}>
							{status.message}
						</Alert>
					)}
				</div>
			)}

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
		</div>
	);
};
