import { Button } from "app/components/Button";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type ProfileCreatedProps = {
	isOpen: boolean;
	onClose?: any;
	onSkip?: any;
	onStart: any;
};

export const ProfileCreated = ({ isOpen, onClose, onSkip, onStart }: ProfileCreatedProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("PROFILE.MODAL_PROFILE_CREATED.TITLE")}
			image={<Image name="ProfileCreatedBanner" domain="profile" className="my-8" />}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="container space-y-8">
				<div className="text-base text-theme-secondary-text leading-7">
					<p>{t("PROFILE.MODAL_PROFILE_CREATED.DESCRIPTION_1")}</p>
					<p>{t("PROFILE.MODAL_PROFILE_CREATED.DESCRIPTION_2")}</p>
				</div>

				<div className="flex justify-end space-x-3">
					<Button variant="secondary" onClick={onSkip}>
						{t("PROFILE.MODAL_PROFILE_CREATED.SKIP_TUTORIAL")}
					</Button>
					<Button onClick={onStart}>{t("PROFILE.MODAL_PROFILE_CREATED.START_TUTORIAL")}</Button>
				</div>
			</div>
		</Modal>
	);
};

ProfileCreated.defaultProps = {
	isOpen: false,
};
