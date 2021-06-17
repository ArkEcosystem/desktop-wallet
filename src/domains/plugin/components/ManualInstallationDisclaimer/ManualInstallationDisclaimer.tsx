import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { FormField } from "app/components/Form";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface ManualInstallationDisclaimerProperties {
	isOpen: boolean;
	onClose?: any;
	onDecline?: any;
	onAccept: (rememberChoice: boolean) => void;
}

export const ManualInstallationDisclaimer = ({
	isOpen,
	onClose,
	onDecline,
	onAccept,
}: ManualInstallationDisclaimerProperties) => {
	const { t } = useTranslation();

	const [rememberChoice, setRememberChoice] = useState(false);

	return (
		<Modal
			title={t("PLUGINS.MANUAL_INSTALLATION_DISCLAIMER.TITLE")}
			image={<Image name="GenericWarning" className="m-auto my-8 w-3/5" />}
			description={t("PLUGINS.MANUAL_INSTALLATION_DISCLAIMER.DISCLAIMER")}
			size="xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<FormField name="rememberChoice" className="flex mt-6">
				<label className="flex items-center space-x-3 w-max cursor-pointer">
					<Checkbox
						name="rememberChoice"
						data-testid="ManualInstallationDisclaimer__rememberChoice-toggle"
						onChange={() => setRememberChoice(!rememberChoice)}
					/>
					<span className="text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
						{t("COMMON.DO_NOT_SHOW_AGAIN")}
					</span>
				</label>
			</FormField>

			<div className="flex justify-end mt-8 space-x-3">
				<Button
					variant="secondary"
					onClick={onDecline}
					data-testid="ManualInstallationDisclaimer__decline-button"
				>
					{t("COMMON.I_DECLINE")}
				</Button>

				<Button
					variant="primary"
					onClick={() => onAccept(rememberChoice)}
					data-testid="ManualInstallationDisclaimer__accept-button"
				>
					{t("COMMON.I_ACCEPT")}
				</Button>
			</div>
		</Modal>
	);
};

ManualInstallationDisclaimer.defaultProps = {
	isOpen: false,
};
