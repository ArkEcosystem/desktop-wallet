import React from "react";
// UI Elements
import { Modal } from "app/components/Modal";
// Assets
import { SvgCollection } from "app/assets/svg";

type Props = {
	type: "success" | "error";
	title: string;
	description: string;
	onClose: any;
	isOpen: boolean;
};

export const VerifyMessageStatus = ({ title, description, type, onClose, isOpen }: Props) => {
	const { Confirmed, Mistake } = SvgCollection;
	const StatusInfo = type === "error" ? Mistake : Confirmed;

	return (
		<Modal title={title} description={description} isOpen={isOpen} onClick={onClose}>
			<StatusInfo className="w-full mt-10" />
		</Modal>
	);
};

VerifyMessageStatus.defaultProps = {
	type: "success",
};
