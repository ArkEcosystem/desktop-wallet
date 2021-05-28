// UI Elements
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { InputDefault } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { TextArea } from "app/components/TextArea";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { useValidation } from "app/hooks";
import cn from "classnames";
import { VerifyMessageStatus } from "domains/wallet/components/VerifyMessageStatus";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
	isOpen: boolean;
	profileId: string;
	walletId: string;
	onSubmit?: any;
	onCancel?: any;
	onClose?: any;
}

const JsonForm = () => {
	const { t } = useTranslation();

	const { register, unregister, setValue } = useFormContext();

	const { verifyMessage } = useValidation();

	useEffect(() => {
		register("jsonString", verifyMessage.jsonString());
	}, [register, verifyMessage]);

	useEffect(() => {
		unregister(["signatory", "message", "signature"]);
	}, [unregister]);

	return (
		<div data-testid="VerifyMessage__json" className="mt-4">
			<FormField name="jsonString">
				<FormLabel label={t("WALLETS.MODAL_VERIFY_MESSAGE.JSON_STRING")} />
				<TextArea
					data-testid="VerifyMessage__json-jsonString"
					className="h-32 py-4"
					placeholder={'{"signatory": "...", "signature": "...", "message": "..."}'}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setValue("jsonString", event.target.value, {
							shouldDirty: true,
							shouldValidate: true,
						})
					}
				/>
			</FormField>
		</div>
	);
};

const ManualForm = () => {
	const { t } = useTranslation();

	const { register, unregister } = useFormContext();

	useEffect(() => {
		unregister("jsonString");
	}, [unregister]);

	return (
		<div data-testid="VerifyMessage__manual" className="mt-4 space-y-8">
			<FormField name="signatory">
				<FormLabel label={t("COMMON.PUBLIC_KEY")} />
				<InputDefault
					data-testid="VerifyMessage__manual-signatory"
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.PUBLIC_KEY"),
						}).toString(),
					})}
				/>
			</FormField>

			<FormField name="message">
				<FormLabel label={t("COMMON.MESSAGE")} />
				<InputDefault
					data-testid="VerifyMessage__manual-message"
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.MESSAGE"),
						}).toString(),
					})}
				/>
			</FormField>

			<FormField name="signature">
				<FormLabel label={t("COMMON.SIGNATURE")} />
				<InputDefault
					data-testid="VerifyMessage__manual-signature"
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.SIGNATURE"),
						}).toString(),
					})}
				/>
			</FormField>
		</div>
	);
};

export const VerifyMessage = ({ profileId, walletId, onSubmit, onCancel, isOpen, onClose }: Props) => {
	const { env } = useEnvironmentContext();

	const form = useForm({ mode: "onChange" });
	const { t } = useTranslation();

	const { getValues, formState } = form;
	const { isValid } = formState;

	const [verificationMethod, setVerificationMethod] = useState("manual");
	const [isMessageVerified, setIsMessageVerified] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const isJson = verificationMethod === "json";

	const handleSubmit = async () => {
		const profile = env?.profiles().findById(profileId);
		const wallet = profile?.wallets().findById(walletId);

		try {
			const signedMessage = isJson
				? JSON.parse(getValues("jsonString"))
				: getValues(["signatory", "message", "signature"]);
			const isVerified = await wallet?.message().verify(signedMessage);

			setIsSubmitted(true);
			setIsMessageVerified(isVerified);
			onSubmit?.(isVerified);
		} catch {
			setIsSubmitted(true);
			setIsMessageVerified(false);
			onSubmit?.(false);
		}
	};

	const statusKey = isMessageVerified ? "SUCCESS" : "ERROR";

	if (isSubmitted) {
		return (
			<VerifyMessageStatus
				title={t(`WALLETS.MODAL_VERIFY_MESSAGE.${statusKey}.TITLE`)}
				description={t(`WALLETS.MODAL_VERIFY_MESSAGE.${statusKey}.DESCRIPTION`)}
				type={isMessageVerified ? "success" : "error"}
				isOpen={isOpen}
				onClose={() => {
					setIsSubmitted(false);
					onClose?.();
				}}
			/>
		);
	}

	return (
		<Modal
			isOpen={isOpen}
			title={t("WALLETS.MODAL_VERIFY_MESSAGE.TITLE")}
			description={t("WALLETS.MODAL_VERIFY_MESSAGE.DESCRIPTION")}
			onClose={() => onClose?.()}
		>
			<div className="flex flex-col mt-8">
				<span className="block mb-1 text-lg font-semibold">
					{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFICATION_METHOD.TITLE")}
				</span>

				<span className="text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-700">
					{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFICATION_METHOD.DESCRIPTION")}
				</span>

				<div className="flex items-center mt-6 space-x-4 text-theme-secondary-500 dark:text-theme-secondary-700">
					<div
						className={cn("text-lg font-semibold", {
							"text-theme-secondary-700 dark:text-theme-secondary-200": isJson,
						})}
					>
						{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFICATION_METHOD.JSON")}
					</div>

					<Toggle
						data-testid="VerifyMessage__toggle"
						checked={!isJson}
						onChange={(event) => setVerificationMethod(event.target.checked ? "manual" : "json")}
						alwaysOn
					/>

					<div
						className={cn("text-lg font-semibold", {
							"text-theme-secondary-700 dark:text-theme-secondary-200": !isJson,
						})}
					>
						{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFICATION_METHOD.MANUAL")}
					</div>
				</div>

				<Form id="VerifyMessage__form" context={form} onSubmit={handleSubmit}>
					{isJson ? <JsonForm /> : <ManualForm />}

					<div className="flex justify-end space-x-3">
						<Button variant="secondary" data-testid="VerifyMessage__cancel" onClick={onCancel}>
							{t("COMMON.CANCEL")}
						</Button>

						<Button data-testid="VerifyMessage__submit" type="submit" disabled={!isValid}>
							{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFY")}
						</Button>
					</div>
				</Form>
			</div>
		</Modal>
	);
};

VerifyMessage.defaultProps = {
	isOpen: false,
};
