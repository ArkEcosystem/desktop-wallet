import { Button } from "app/components/Button";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type AdvancedModeProps = {
	isOpen: boolean;
	onClose?: any;
	onDecline?: any;
	onAccept?: any;
};

export const AdvancedMode = ({ isOpen, onClose, onDecline, onAccept }: AdvancedModeProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("SETTINGS.MODAL_ADVANCED_MODE.TITLE")}
			image={<Image name="GenericWarning" className="w-3/5 m-auto my-8" />}
			description={t("SETTINGS.MODAL_ADVANCED_MODE.DISCLAIMER")}
			size="xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="flex justify-end mt-8 space-x-3">
				<Button variant="secondary" onClick={onDecline} data-testid="AdvancedMode__decline-button">
					{t("COMMON.I_DECLINE")}
				</Button>

				<Button variant="primary" onClick={onAccept} data-testid="AdvancedMode__accept-button">
					{t("COMMON.I_ACCEPT")}
				</Button>
			</div>
		</Modal>
	);
};

AdvancedMode.defaultProps = {
	isOpen: false,
};
