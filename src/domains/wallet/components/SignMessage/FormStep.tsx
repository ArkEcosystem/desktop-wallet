import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Avatar } from "app/components/Avatar";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Input, InputDefault, InputPassword } from "app/components/Input";
import { useValidation } from "app/hooks";
import React, { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({
	wallet,
	disableMessageInput,
}: {
	wallet: ReadWriteWallet;
	disableMessageInput?: boolean;
}) => {
	const { t } = useTranslation();

	const { authentication } = useValidation();

	const { register, setValue } = useFormContext();

	return (
		<section className="space-y-8">
			<Header
				title={t("WALLETS.MODAL_SIGN_MESSAGE.FORM_STEP.TITLE")}
				subtitle={t("WALLETS.MODAL_SIGN_MESSAGE.FORM_STEP.DESCRIPTION")}
			/>

			<FormField name="signatory-address">
				<FormLabel label={t("WALLETS.SIGNATORY")} />
				<Input
					innerClassName="font-semibold"
					value={wallet.address()}
					addons={{
						start: <Avatar address={wallet.address()} size="sm" noShadow />,
					}}
					disabled
				/>
			</FormField>

			<FormField name="message">
				<FormLabel label={t("COMMON.MESSAGE")} />
				<InputDefault
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("COMMON.MESSAGE"),
						}).toString(),
					})}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setValue("message", event.target.value, {
							shouldDirty: true,
							shouldValidate: true,
						})
					}
					data-testid="SignMessage__message-input"
					readOnly={disableMessageInput}
				/>
			</FormField>

			{!wallet.isLedger() && (
				<FormField name="mnemonic">
					<FormLabel label={t("COMMON.YOUR_PASSPHRASE")} />
					<InputPassword
						ref={register(authentication.mnemonic(wallet.coin(), wallet.address()))}
						data-testid="SignMessage__mnemonic-input"
					/>
				</FormField>
			)}
		</section>
	);
};

FormStep.defaultProps = {
	disableMessageInput: false,
};
