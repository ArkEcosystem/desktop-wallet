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
	const image = type === "success" ? "SuccessBanner" : "ErrorBanner";

	return (
		<Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
			<Image name={image} className="mt-8 w-full" />
		</Modal>
	);
};

VerifyMessageStatus.defaultProps = {
	type: "success",
	isOpen: false,
};
