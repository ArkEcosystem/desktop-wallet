import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type AdvancedModeProps = {
	isOpen: boolean;
	onAccept?: any;
	onDecline?: any;
	onClose?: any;
};

export const AdvancedMode = (props: AdvancedModeProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("SETTINGS.MODAL_ADVANCED_MODE.TITLE")}
			description={t("SETTINGS.MODAL_ADVANCED_MODE.DISCLAIMER")}
			size="xl"
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="flex justify-end pb-5 mt-8 space-x-3">
				<Button variant="plain" onClick={props.onDecline}>
					{t("COMMON.I_DECLINE")}
				</Button>

				<Button variant="solid" onClick={props.onAccept}>
					{t("COMMON.I_ACCEPT")}
				</Button>
			</div>
		</Modal>
	);
};

AdvancedMode.defaultProps = {
	isOpen: false,
};
