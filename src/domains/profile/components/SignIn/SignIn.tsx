import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { AvatarWrapper } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import { Modal } from "app/components/Modal";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type SignInProps = {
	isOpen: boolean;
	profile: Profile;
	onCancel?: any;
	onClose?: any;
	onSuccess: any;
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
			onSuccess();
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
					{profile.avatar().endsWith("</svg>") ? (
						<AvatarWrapper size="lg" data-testid="profile-card__user--avatar" noShadow>
							<img
								src={`data:image/svg+xml;utf8,${profile.avatar()}`}
								title={profile.name()}
								alt={profile.name()}
							/>
							<span className="absolute font-semibold text-theme-background">
								{profile.name().slice(0, 2).toUpperCase()}
							</span>
						</AvatarWrapper>
					) : (
						<div
							className="w-11 h-11 rounded-full bg-theme-secondary-100"
							data-testid="profile-card__user--avatarImage"
						>
							<img
								src={profile.avatar()}
								className="object-cover w-11 h-11 bg-center bg-no-repeat bg-cover rounded-full"
								title={profile.name()}
								alt={profile.name()}
							/>
						</div>
					)}

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
					<FormHelperText />
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
