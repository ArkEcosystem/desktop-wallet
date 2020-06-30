import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

import { RepositoryLink, RepositoryLinkProps } from "./components/RepositoryLink";

type Props = {
	isOpen?: boolean;
	handleClose?: any;
	repositories?: any;
};

export const RepositoryModal = ({ isOpen, handleClose, repositories }: Props) => {
	const { t } = useTranslation();

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={t("PROFILE.MODAL_REPOSITORIES.TITLE")} size="sm">
			<div className="flex flex-col space-y-5 mt-5">
				{repositories.map(({ provider, url }: RepositoryLinkProps) => (
					<RepositoryLink key={provider} provider={provider} url={url} />
				))}
			</div>
		</Modal>
	);
};

RepositoryModal.defaultProps = {
	isOpen: false,
	repositories: [],
};
