// UI Elements
import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputDefault } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { Toggle } from "app/components/Toggle";
import { useEnvironmentContext } from "app/contexts";
import { VerifyMessageStatus } from "domains/wallet/components/VerifyMessageStatus";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
	isOpen: boolean;
	signatory?: string;
	profileId: string;
	walletId: string;
	onSubmit?: any;
	onCancel?: any;
	onClose?: any;
};

export const VerifyMessage = ({ profileId, walletId, onSubmit, onCancel, signatory, isOpen, onClose }: Props) => {
	const { env } = useEnvironmentContext();
	const form = useForm();
	const { t } = useTranslation();

	const { register } = form;
	const [verifyAddress, setVerifyAddress] = useState(true);
	const [isMessageVerified, setIsMessageVerified] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async () => {
		let isVerified = false;
		const formValues = form.getValues();
		const profile = env?.profiles().findById(profileId);
		const wallet = profile?.wallets().findById(walletId);

		try {
			const signedMessage = verifyAddress ? JSON.parse(formValues["signed-message-content"]) : formValues;
			isVerified = await wallet?.message().verify(signedMessage);
			setIsSubmitted(true);
			setIsMessageVerified(isVerified);
			onSubmit?.(isVerified);
		} catch {
			setIsSubmitted(true);
			setIsMessageVerified(false);
			onSubmit?.(false);
		}
	};

	const renderFormContent = () => {
		if (verifyAddress) {
			return (
				<div className="mt-8">
					<Alert>
						<span>{`Format(JSON): { "signatory": "...", "signature": "...", "message": "..."}`}</span>
					</Alert>

					<div className="mt-8">
						<FormField name="signed-message-content">
							<FormLabel label="Signed message content" />
							<InputDefault
								data-testid="VerifyMessage_message-content"
								defaultValue={""}
								ref={register({ required: true })}
							/>
							<FormHelperText />
						</FormField>
					</div>
				</div>
			);
		}

		return (
			<div data-testid="noverify-address__content">
				<FormField name="message" className="mt-8">
					<FormLabel label={t("COMMON.MESSAGE")} />
					<InputDefault
						data-testid="VerifyMessage__message-input"
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.MESSAGE"),
							}).toString(),
						})}
					/>
					<FormHelperText />
				</FormField>
				<FormField name="signatory" className="mt-8">
					<FormLabel label={t("COMMON.PUBLIC_KEY")} />
					<InputDefault
						data-testid="VerifyMessage__signatory-input"
						defaultValue={signatory}
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.PUBLIC_KEY"),
							}).toString(),
						})}
						disabled
					/>
					<FormHelperText />
				</FormField>
				<FormField name="signature" className="mt-8">
					<FormLabel label={t("COMMON.SIGNATURE")} />
					<InputDefault
						data-testid="VerifyMessage__signature-input"
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.SIGNATURE"),
							}).toString(),
						})}
					/>
					<FormHelperText />
				</FormField>
			</div>
		);
	};

	if (isSubmitted) {
		const statusKey = isMessageVerified ? "SUCCESS" : "FAIL";
		return (
			<VerifyMessageStatus
				title={t(`WALLETS.MODAL_VERIFY_MESSAGE.${statusKey}_TITLE`)}
				description={t(`WALLETS.MODAL_VERIFY_MESSAGE.${statusKey}_DESCRIPTION`)}
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
			<div className="mt-8">
				<div className="flex flex-col pb-6 border-b border-dashed border-theme-secondary-400">
					<div className="flex flex-col">
						<div className="flex justify-between items-center">
							<div className="text-lg font-semibold">
								{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFY_JSON.TITLE")}
							</div>

							<Toggle
								data-testid="verify-address__toggle"
								checked={verifyAddress}
								onChange={(event) => setVerifyAddress(event.target.checked)}
							/>
						</div>

						<div className="pr-12 mt-1 text-sm text-theme-secondary-500">
							{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFY_JSON.DESCRIPTION")}
						</div>
					</div>
				</div>

				<Form id="VerifyMessage__form" context={form} onSubmit={handleSubmit}>
					{renderFormContent()}
					<div className="flex justify-end space-x-3">
						<Button variant="secondary" data-testid="VerifyMessage__cancel" onClick={onCancel}>
							{t("COMMON.CANCEL")}
						</Button>
						<Button data-testid="VerifyMessage__submit" onClick={handleSubmit} type="submit">
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
