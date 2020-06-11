import React from "react";
// Status templates
import * as templates from "./templates";
// UI Elements
import { Modal } from "app/components/Modal";

type Props = {
	template: string;
	type: "success" | "error";
	onClose: any;
	isOpen: boolean;
};

export const MessageStatus = ({ template, type, onClose, isOpen }: Props) => {
	const Template = templates[template];

	return (
		<Modal isOpen={isOpen} onClick={onClose}>
			<Template type={type} />
		</Modal>
	);
};

MessageStatus.defaultProps = {
	isOpen: false,
};
