import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { alias } from "domains/wallet/validations";
import React  from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { assertWallet } from "utils/assertions";

interface UpdateWalletNameProperties {
	walletAddress: string;
	profile: Contracts.IProfile;
	isOpen: boolean;
	onClose?: () => void;
	onCancel?: () => void;
	onSave: (alias: string) => void;
}

export const UpdateWalletName = ({
	walletAddress,
	profile,
	isOpen = false,
	onClose,
	onCancel,
	onSave,
}: UpdateWalletNameProperties) => {
	const methods = useForm<Record<string, any>>({ mode: "onChange" });
	const { formState, register } = methods;
	const { isValid, errors } = formState;

	const { t } = useTranslation();

	const aliasValidation = alias({ profile, t, walletAddress })

	const wallet = profile.wallets().findByAddress(walletAddress);
	assertWallet(wallet);

	const onSubmit = ({ name }: { name: string }) => {
		onSave(name.trim());
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
					<FormLabel optional>{t("WALLETS.WALLET_NAME")}</FormLabel>
					<div className="relative">
						<Input
							errorMessage={errors["name"]?.message}
							isInvalid={!isValid}
							data-testid="UpdateWalletName__input"
							ref={register(aliasValidation)}
							defaultValue={wallet.alias()}
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
