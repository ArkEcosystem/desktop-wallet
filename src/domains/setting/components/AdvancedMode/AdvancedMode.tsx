import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { FormField } from "app/components/Form";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type AdvancedModeProps = {
	isOpen: boolean;
	onClose?: any;
	onDecline?: any;
	onAccept: (rememberChoice: boolean) => void;
};

export const AdvancedMode = ({ isOpen, onClose, onDecline, onAccept }: AdvancedModeProps) => {
	const { t } = useTranslation();

	const [rememberChoice, setRememberChoice] = useState(false);

	return (
		<Modal
			title={t("SETTINGS.MODAL_ADVANCED_MODE.TITLE")}
			image={<Image name="GenericWarning" className="w-3/5 m-auto my-8" />}
			description={t("SETTINGS.MODAL_ADVANCED_MODE.DISCLAIMER")}
			size="xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<FormField name="rememberChoice" className="flex flex-col space-y-2 mt-6">
				<label className="flex items-center space-x-2">
					<Checkbox
						name="rememberChoice"
						data-testid="AdvancedMode__rememberChoice-toggle"
						onChange={() => setRememberChoice(!rememberChoice)}
					/>
					<span className="text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
						{t("COMMON.DO_NOT_SHOW_AGAIN")}
					</span>
				</label>
			</FormField>

			<div className="flex justify-end mt-8 space-x-3">
				<Button variant="secondary" onClick={onDecline} data-testid="AdvancedMode__decline-button">
					{t("COMMON.I_DECLINE")}
				</Button>

				<Button
					variant="primary"
					onClick={() => onAccept(rememberChoice)}
					data-testid="AdvancedMode__accept-button"
				>
					{t("COMMON.I_ACCEPT")}
				</Button>
			</div>
		</Modal>
	);
};

AdvancedMode.defaultProps = {
	isOpen: false,
};
