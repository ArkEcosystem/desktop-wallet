import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import React, { useEffect } from "react";
import { useForm, Validate } from "react-hook-form";
import { useTranslation } from "react-i18next";

type UpdateWalletNameProps = {
	currentAlias?: string;
	walletId?: string;
	profile: Profile;
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onSave: any;
	validation?: Validate;
};

export const UpdateWalletName = ({
	currentAlias,
	walletId,
	profile,
	isOpen,
	onClose,
	onCancel,
	onSave,
	validation,
}: UpdateWalletNameProps) => {
	const methods = useForm<Record<string, any>>({ mode: "onChange", defaultValues: { name: currentAlias } });
	const { formState, register, setValue } = methods;
	const { isValid, errors } = formState;

	const { t } = useTranslation();
	const nameMaxLength = 42;

	useEffect(() => {
		if (isOpen) {
			setValue("name", currentAlias);
		}
	}, [currentAlias, isOpen, setValue]);

	const onSubmit = ({ name }: any) => {
		onSave(name.trim().substring(0, nameMaxLength));
	};

	return (
		<Modal
			title={t("WALLETS.MODAL_NAME_WALLET.TITLE")}
			description={t("WALLETS.MODAL_NAME_WALLET.DESCRIPTION")}
			size="lg"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="mt-8">
				<FormField name="name">
					<FormLabel required={false}>{t("COMMON.NAME")}</FormLabel>
					<div className="relative">
						<Input
							errorMessage={errors["name"]?.message}
							isInvalid={!isValid}
							data-testid="UpdateWalletName__input"
							ref={register({
								validate: {
									whitespaceOnly: (alias) => {
										if (alias.length) {
											return (
												!!alias.trim().length ||
												t("COMMON.VALIDATION.FIELD_INVALID", {
													field: t("COMMON.NAME"),
												}).toString()
											);
										}

										return true;
									},
									duplicateAlias: (alias) =>
										!alias ||
										!profile
											.wallets()
											.values()
											.filter(
												(item: ReadWriteWallet) =>
													item.id() !== walletId &&
													item.alias() &&
													item.alias()!.trim().toLowerCase() === alias.trim().toLowerCase(),
											).length ||
										t("WALLETS.PAGE_CREATE_WALLET.VALIDATION.ALIAS_EXISTS", {
											alias: alias.trim(),
										}).toString(),
									validation: validation!,
								},
								maxLength: {
									value: nameMaxLength,
									message: t("COMMON.VALIDATION.MAX_LENGTH", {
										field: t("COMMON.NAME"),
										maxLength: nameMaxLength,
									}),
								},
							})}
						/>
					</div>
				</FormField>

				<div className="flex justify-end mt-8 space-x-3">
					<Button data-testid="UpdateWalletName__cancel" variant="secondary" onClick={onCancel}>
						{t("COMMON.CANCEL")}
					</Button>

					<Button
						type="button"
						data-testid="UpdateWalletName__submit"
						disabled={!isValid}
						onClick={methods.handleSubmit(onSubmit)}
					>
						{t("COMMON.SAVE")}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

UpdateWalletName.defaultProps = {
	isOpen: false,
	validation: () => true,
};

UpdateWalletName.displayName = "UpdateWalletName";
