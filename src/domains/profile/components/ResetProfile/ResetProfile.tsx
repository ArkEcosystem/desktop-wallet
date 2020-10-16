import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { toasts } from "app/services";
import React from "react";
import { useTranslation } from "react-i18next";

const DeleteBanner = images.common.DeleteBanner;

type ResetProfileProps = {
	isOpen: boolean;
	profile: Profile;
	onClose?: any;
	onCancel?: any;
	onReset?: any;
};

export const ResetProfile = ({ isOpen, profile, onClose, onCancel, onReset }: ResetProfileProps) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();

	const handleReset = async () => {
		profile.flush();

		await persist();

		toasts.success(t("PROFILE.MODAL_RESET_PROFILE.SUCCESS"));

		onReset?.();
	};

	return (
		<Modal
			title={t("PROFILE.MODAL_RESET_PROFILE.TITLE")}
			image={<DeleteBanner className="w-3/5 m-auto my-8" />}
			description={t("PROFILE.MODAL_RESET_PROFILE.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="flex justify-end mt-8 space-x-3">
				<Button variant="plain" onClick={onCancel} data-testid="ResetProfile__cancel-button">
					{t("COMMON.CANCEL")}
				</Button>

				<Button type="submit" onClick={handleReset} data-testid="ResetProfile__submit-button">
					<Icon name="Reset" />
					<span>{t("COMMON.RESET_DATA")}</span>
				</Button>
			</div>
		</Modal>
	);
};

ResetProfile.defaultProps = {
	isOpen: false,
};
