import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
// UI Elements
import { Modal } from "app/components/Modal";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type DeleteWalletProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDelete: any;
};

const DeleteBanner = images.common.DeleteBanner;

export const DeleteWallet = (props: DeleteWalletProps) => {
	const methods = useForm({ mode: "onChange" });
	const { t } = useTranslation();

	return (
		<Modal
			title={t("WALLETS.MODAL_DELETE_WALLET.TITLE")}
			image={<DeleteBanner className="w-3/5 m-auto mb-8" />}
			description={t("WALLETS.MODAL_DELETE_WALLET.DESCRIPTION")}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="flex justify-end mt-8">
				<Button color="primary" variant="plain" onClick={props.onCancel} className="mr-2">
					{t("COMMON.CANCEL")}
				</Button>

				<Button
					type="submit"
					color="primary"
					variant="solid"
					onClick={props.onDelete}
					className="flex items-center"
				>
					<Icon name="Trash" />

					<span className="ml-2">{t("COMMON.DELETE")}</span>
				</Button>
			</div>
		</Modal>
	);
};

DeleteWallet.defaultProps = {
	isOpen: false,
};

DeleteWallet.displayName = "DeleteWallet";
