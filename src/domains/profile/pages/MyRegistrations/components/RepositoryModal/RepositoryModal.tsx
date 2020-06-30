import { Modal } from "app/components/Modal";
import React from "react";

type Props = {
	isOpen?: boolean;
	handleClose?: any;
};

export const RepositoryModal = ({ isOpen, handleClose }: Props) => (
	<Modal isOpen={isOpen} onClose={handleClose} title="Repository" size="sm">
		<span>Oi</span>
	</Modal>
);

RepositoryModal.defaultProps = {
	isOpen: false,
};
