import { MemoryPassword, Profile } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { ProfileAvatar } from "domains/profile/components/ProfileAvatar";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type SignInProps = {
	isOpen: boolean;
	profile: Profile;
	onCancel?: any;
	onClose?: any;
	onSuccess: (password: string) => void;
};

const MAX_ATTEMPTS = 3;
const TIMEOUT = 60;

export const SignIn = ({ isOpen, profile, onCancel, onClose, onSuccess }: SignInProps) => {
	const { t } = useTranslation();

	const methods = useForm({ mode: "onChange" });
	const { errors, formState, register, setError } = methods;

	const [count, setCount] = useState(0);
	const [remainingTime, setRemainingTime] = useState(0);

	const hasReachedLimit = useCallback(() => count >= MAX_ATTEMPTS, [count]);

	useEffect(() => {
		if (hasReachedLimit()) {
			setRemainingTime(TIMEOUT);
		}

		if (count) {
			const timer = setInterval(() => {
				setCount(count - 1);
			}, TIMEOUT * 1000);

			return () => clearInterval(timer);
		}
	}, [count, hasReachedLimit]);

	useEffect(() => {
		if (remainingTime) {
			setError("password", {
				type: "maxAttempts",
				message: t("PROFILE.MODAL_SIGN_IN.MAX_ATTEMPTS_ERROR", { remainingTime }),
			});

			const timer = setInterval(() => {
				setRemainingTime(remainingTime - 1);
			}, 1000);

			return () => clearInterval(timer);
		} else if (errors.password) {
			setError("password", {
				type: "invalid",
				message: t("COMMON.VALIDATION.SUBJECT_INVALID", {
					subject: t("COMMON.PASSWORD"),
				}),
			});
		}
	}, [errors, remainingTime, setError, t]);

	const handleSubmit = ({ password }: any) => {
		if (profile.auth().verifyPassword(password)) {
			MemoryPassword.set(profile, password);
			onSuccess(password);
		} else {
			setCount(count + 1);

			setError("password", {
				type: "invalid",
				message: t("COMMON.VALIDATION.SUBJECT_INVALID", {
					subject: t("COMMON.PASSWORD"),
				}),
			});
		}
	};

	return (
		<Modal
			title={t("PROFILE.MODAL_SIGN_IN.TITLE")}
			description={t("PROFILE.MODAL_SIGN_IN.DESCRIPTION")}
			size="md"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8">
				<div className="flex items-center space-x-3">
					<ProfileAvatar profile={profile} />

					<div className="flex flex-col">
						<p className="text-sm font-semibold text-theme-secondary-700">{t("COMMON.NAME")}</p>
						<p className="font-semibold text-theme-text" data-testid="profile-card__user--name">
							<span>{profile.name()}</span>
						</p>
					</div>
				</div>
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
						disabled={hasReachedLimit()}
						data-testid="SignIn__input--password"
					/>
				</FormField>

				<div className="flex justify-end mt-8 space-x-3">
					<Button data-testid="SignIn__cancel-button" variant="secondary" onClick={onCancel}>
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
