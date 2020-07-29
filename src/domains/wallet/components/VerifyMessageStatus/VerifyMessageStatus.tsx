import { images } from "app/assets/images";
import { Modal } from "app/components/Modal";
import React from "react";

type Props = {
	type?: "success" | "error";
	title?: string;
	description?: string;
	onClose?: any;
	isOpen: boolean;
};

export const VerifyMessageStatus = ({ title, description, type, onClose, isOpen }: Props) => {
	const { ConfirmedBanner, MistakeBanner } = images.common;
	const StatusInfo = type === "success" ? ConfirmedBanner : MistakeBanner;

	return (
		<Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
			<StatusInfo className="w-full mt-8" />
		</Modal>
	);
};

VerifyMessageStatus.defaultProps = {
	type: "success",
	isOpen: false,
};
