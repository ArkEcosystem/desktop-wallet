import { Button } from "app/components/Button";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type ConfirmSendTransactionProps = {
	isOpen: boolean;
	onClose?: any;
	onConfirm?: any;
};

// TODO: Update modal inner content when designs are ready
export const ConfirmSendTransaction = ({ isOpen, onClose, onConfirm }: ConfirmSendTransactionProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("TRANSACTION.MODAL_CONFIRM_SEND_TRANSACTION.TITLE")}
			image={<Image name="WalletUpdateBanner" domain="wallet" className="my-8" />}
			description={t("TRANSACTION.MODAL_CONFIRM_SEND_TRANSACTION.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="flex justify-end mt-8 space-x-3">
				<Button variant="secondary" onClick={onClose} data-testid="ConfirmSendTransaction__cancel">
					{t("COMMON.CANCEL")}
				</Button>

				<Button type="submit" data-testid="ConfirmSendTransaction__confirm" onClick={onConfirm}>
					{t("COMMON.CONFIRM")}
				</Button>
			</div>
		</Modal>
	);
};
