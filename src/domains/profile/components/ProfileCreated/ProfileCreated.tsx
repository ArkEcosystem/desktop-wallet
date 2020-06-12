// Packages
import React from "react";
import { useTranslation } from "react-i18next";

// Components
import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";

// Assets
import { images } from "app/assets/images";

type ProfileCreatedProps = {
	isOpen: boolean;
	onClose?: any;
	onSkip?: any;
	onStart: any;
};

const { ProfileCreatedBanner } = images.profile.components.profileCreated;

export const ProfileCreated = (props: ProfileCreatedProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("PROFILE.MODAL_PROFILE_CREATED.TITLE")}
			image={<ProfileCreatedBanner className="my-10" />}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="container">
				<div className="mb-6 text-center">
					<p className="mb-1 text-sm text-theme-neutral-dark md:text-base">
						{t("PROFILE.MODAL_PROFILE_CREATED.DESCRIPTION_1")}
					</p>
					<p className="text-sm text-theme-neutral-dark md:text-base">
						{t("PROFILE.MODAL_PROFILE_CREATED.DESCRIPTION_2")}
					</p>
				</div>

				<div className="flex flex-col justify-center sm:flex-row">
					<Button color="primary" variant="solid" className="mr-2" onClick={props.onStart}>
						{t("PROFILE.MODAL_PROFILE_CREATED.START_TUTORIAL")}
					</Button>
					<Button color="primary" variant="plain" className="mt-2 sm:mt-0" onClick={props.onSkip}>
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
