import { images } from "app/assets/images";
import { Modal } from "app/components/Modal";
import React from "react";

type Props = {
	type?: "success" | "error";
	title?: string;
	description?: string;
	isOpen: boolean;
	onClose?: () => void;
};

export const VerifyMessageStatus = ({ title, description, type, isOpen, onClose }: Props) => {
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
