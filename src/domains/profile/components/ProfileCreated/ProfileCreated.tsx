import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type ProfileCreatedProps = {
	isOpen: boolean;
	onClose?: any;
	onSkip?: any;
	onStart: any;
};

const { ProfileCreatedBanner } = images.profile.components.profileCreated;

export const ProfileCreated = ({ isOpen, onClose, onSkip, onStart }: ProfileCreatedProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("PROFILE.MODAL_PROFILE_CREATED.TITLE")}
			image={<ProfileCreatedBanner className="my-8" />}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="container">
				<div className="mb-8 text-center">
					<p className="mb-1 text-sm text-theme-neutral-dark md:text-base">
						{t("PROFILE.MODAL_PROFILE_CREATED.DESCRIPTION_1")}
					</p>
					<p className="text-sm text-theme-neutral-dark md:text-base">
						{t("PROFILE.MODAL_PROFILE_CREATED.DESCRIPTION_2")}
					</p>
				</div>

				<div className="flex flex-col justify-center space-x-0 sm:flex-row sm:space-x-3">
					<Button onClick={onStart}>{t("PROFILE.MODAL_PROFILE_CREATED.START_TUTORIAL")}</Button>
					<Button variant="plain" className="mt-2 sm:mt-0" onClick={onSkip}>
						{t("PROFILE.MODAL_PROFILE_CREATED.SKIP_TUTORIAL")}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

ProfileCreated.defaultProps = {
	isOpen: false,
};
