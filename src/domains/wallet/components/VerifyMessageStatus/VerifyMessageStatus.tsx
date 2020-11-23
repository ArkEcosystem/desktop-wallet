import { Image } from "app/components/Image";
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
	const image = type === "success" ? "ConfirmedBanner" : "MistakeBanner";

	return (
		<Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
			<Image name={image} className="w-full mt-8" />
		</Modal>
	);
};

VerifyMessageStatus.defaultProps = {
	type: "success",
	isOpen: false,
};
