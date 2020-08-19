import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { ProfileCardContent } from "domains/profile/components/ProfileCard";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type SignInProps = {
	isOpen: boolean;
	profile: Profile;
	onCancel?: any;
	onClose?: any;
	onSuccess: any;
};

export const SignIn = ({ isOpen, profile, onCancel, onClose, onSuccess }: SignInProps) => {
	const { t } = useTranslation();

	const methods = useForm({ mode: "onChange" });
	const { formState, register, setError } = methods;

	const handleSubmit = ({ password }: any) => {
		if (profile.auth().verifyPassword(password)) {
			onSuccess();
		} else {
			setError(
				"password",
				"invalid",
				t("COMMON.VALIDATION.SUBJECT_INVALID", {
					subject: t("COMMON.PASSWORD"),
				}),
			);
		}
	};

	return (
		<Modal
			title={t("PROFILE.MODAL_SIGN_IN.TITLE")}
			description={t("PROFILE.MODAL_SIGN_IN.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8">
				<ProfileCardContent profile={profile} />
			</div>

			<Divider dashed={true} />

			<Form context={methods} onSubmit={handleSubmit} className="mt-8">
				<FormField name="password">
					<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.PASSWORD")} required />
					<InputPassword
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.PASSWORD"),
							}).toString(),
						})}
						data-testid="SignIn__input--password"
					/>
					<FormHelperText />
				</FormField>

				<div className="flex justify-end mt-8 space-x-3">
					<Button data-testid="SignIn__cancel-button" variant="plain" onClick={onCancel}>
						{t("COMMON.CANCEL")}
					</Button>

					<Button data-testid="SignIn__submit-button" type="submit" disabled={!formState.isValid}>
						{t("COMMON.SIGN_IN")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
