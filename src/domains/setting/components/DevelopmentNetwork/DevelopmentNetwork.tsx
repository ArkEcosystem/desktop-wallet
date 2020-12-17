import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type DevelopmentNetworkProps = {
	isOpen: boolean;
	onClose?: () => void;
	onCancel?: () => void;
	onContinue?: () => void;
};

export const DevelopmentNetwork = ({ isOpen, onClose, onCancel, onContinue }: DevelopmentNetworkProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("SETTINGS.MODAL_DEVELOPMENT_NETWORK.TITLE")}
			description={t("SETTINGS.MODAL_DEVELOPMENT_NETWORK.DESCRIPTION")}
			size="xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="flex justify-end mt-8 space-x-3">
				<Button variant="secondary" onClick={onCancel} data-testid="DevelopmentNetwork__cancel-button">
					{t("COMMON.CANCEL")}
				</Button>

				<Button onClick={onContinue} data-testid="DevelopmentNetwork__continue-button">
					{t("COMMON.CONTINUE")}
				</Button>
			</div>
		</Modal>
	);
};

DevelopmentNetwork.defaultProps = {
	isOpen: false,
};
