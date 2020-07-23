// UI Elements
import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { Toggle } from "app/components/Toggle";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Props = {
	onSubmit?: any;
	isOpen: boolean;
	handleClose?: any;
	publicKey?: string;
};

export const VerifyMessage = ({ onSubmit, publicKey, isOpen, handleClose }: Props) => {
	const form = useForm();

	const { t } = useTranslation();

	const { register } = form;
	const [verifyAddress, setVerifyAddress] = useState(true);

	const renderFormContent = () => {
		if (verifyAddress)
			return (
				<div className="mt-8">
					<Alert variant="warning">
						<span className="text-sm font-medium">{`Format(JSON): { "publicKey": "...", "signature": "...", "message": "..."}`}</span>
					</Alert>

					<div className="mt-8">
						<FormField name="signet-message-content">
							<FormLabel label="Signet message content" />
							<Input
								type="text"
								name="signet-message-content"
								defaultValue={""}
								ref={register({ required: true })}
							/>
							<FormHelperText />
						</FormField>
					</div>
				</div>
			);

		return (
			<div data-testid="noverify-address__content">
				<FormField name="message-content" className="mt-8">
					<FormLabel label={t("COMMON.MESSAGE")} />
					<Input
						type="text"
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.MESSAGE"),
							}).toString(),
						})}
					/>
					<FormHelperText />
				</FormField>
				<FormField name="public-key" className="mt-8">
					<FormLabel label={t("COMMON.PUBLIC_KEY")} />
					<Input
						type="text"
						defaultValue={publicKey}
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
					<Input
						type="text"
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
	return (
		<Modal
			isOpen={isOpen}
			title={t("WALLETS.MODAL_VERIFY_MESSAGE.TITLE")}
			description={t("WALLETS.MODAL_VERIFY_MESSAGE.DESCRIPTION")}
			onClose={handleClose}
		>
			<div className="mt-8">
				<div className="flex flex-col pb-6 border-b border-dashed border-theme-neutral-light">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
							<div className="text-lg font-semibold">
								{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFY_JSON.TITLE")}
							</div>

							<Toggle
								data-testid="verify-address__togle"
								checked={verifyAddress}
								onChange={(event) => setVerifyAddress(event.target.checked)}
							/>
						</div>

						<div className="pr-12 mt-1 text-sm text-theme-neutral">
							{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFY_JSON.DESCRIPTION")}
						</div>
					</div>
				</div>

				<Form id="verify-message__form" context={form} onSubmit={onSubmit}>
					{renderFormContent()}
					<div className="flex justify-end space-x-3">
						<Button variant="plain">{t("COMMON.CANCEL")}</Button>
						<Button>{t("WALLETS.MODAL_VERIFY_MESSAGE.VERIFY")}</Button>
					</div>
				</Form>
			</div>
		</Modal>
	);
};

VerifyMessage.defaultProps = {
	isOpen: false,
};
