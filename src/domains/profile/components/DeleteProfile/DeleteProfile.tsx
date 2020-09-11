import { DeleteResource } from "app/components/DeleteResource";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { useTranslation } from "react-i18next";

type DeleteProfileProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDelete?: any;
	profileId: string;
};

export const DeleteProfile = ({ isOpen, onClose, onCancel, onDelete, profileId }: DeleteProfileProps) => {
	const { t } = useTranslation();

	const { env, persist } = useEnvironmentContext();

	const handleDelete = async () => {
		env.profiles().forget(profileId);
		await persist();

		onDelete?.(profileId);
	};

	return (
		<DeleteResource
			title={t("PROFILE.MODAL_DELETE_PROFILE.TITLE")}
			description={t("PROFILE.MODAL_DELETE_PROFILE.DESCRIPTION")}
			isOpen={isOpen}
			onClose={onClose}
			onCancel={onCancel}
			onDelete={handleDelete}
		/>
	);
};

DeleteProfile.defaultProps = {
	isOpen: false,
};
