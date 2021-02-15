import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputDefault, InputPassword } from "app/components/Input";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({ wallet, onCancel }: { wallet: ReadWriteWallet; onCancel?: () => void }) => {
	const { register } = useFormContext();
	const { t } = useTranslation();

	return (
		<>
			<Header
				title={t("WALLETS.MODAL_SIGN_MESSAGE.TITLE")}
				subtitle={t("WALLETS.MODAL_SIGN_MESSAGE.DESCRIPTION")}
			/>

			<FormField name="signatory-address">
				<FormLabel label={t("WALLETS.SIGNATORY")} />
				<div className="relative">
					<Input type="text" disabled />
					<div className="flex absolute top-0 items-center mt-2 ml-4">
						<div className="flex items-center">
							<Avatar address={wallet.address()} size="sm" noShadow />
							<span className="ml-3 font-semibold ">{wallet.address()}</span>
						</div>
					</div>
				</div>
			</FormField>

			<FormField name="message">
				<FormLabel label={t("COMMON.MESSAGE")} />
				<InputDefault
					type="text"
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.MESSAGE"),
						}).toString(),
					})}
					data-testid="SignMessage__message-input"
				/>
			</FormField>

			{!wallet.isLedger() ? (
				<FormField name="mnemonic">
					<FormLabel label={t("COMMON.YOUR_PASSPHRASE")} />
					<InputPassword
						ref={register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.YOUR_PASSPHRASE"),
							}).toString(),
						})}
						data-testid="SignMessage__mnemonic-input"
					/>
				</FormField>
			) : null}

			<div className="flex justify-end space-x-3">
				<Button variant="secondary" onClick={onCancel} data-testid="SignMessage__cancel">
					{t("COMMON.CANCEL")}
				</Button>
				<Button type="submit" data-testid="SignMessage__submit-button">
					{t("WALLETS.MODAL_SIGN_MESSAGE.SIGN")}
				</Button>
			</div>
		</>
	);
};
