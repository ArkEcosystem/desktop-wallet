import { DeleteResource } from "app/components/DeleteResource";
import React from "react";
import { useTranslation } from "react-i18next";

interface DeleteWalletProperties {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDelete: any;
}

export const DeleteWallet = ({ isOpen, onClose, onCancel, onDelete }: DeleteWalletProperties) => {
	const { t } = useTranslation();

	return (
		<DeleteResource
			title={t("WALLETS.MODAL_DELETE_WALLET.TITLE")}
			description={t("WALLETS.MODAL_DELETE_WALLET.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
			onCancel={onCancel}
			onDelete={onDelete}
		/>
	);
};

DeleteWallet.defaultProps = {
	isOpen: false,
};
