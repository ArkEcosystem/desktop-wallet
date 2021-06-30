import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React from "react";

interface Properties {
	type?: "success" | "error";
	title?: string;
	description?: string;
	isOpen: boolean;
	onClose?: () => void;
}

export const VerifyMessageStatus = ({ title, description, type, isOpen, onClose }: Properties) => {
	const image = type === "success" ? "SuccessBanner" : "ErrorBanner";

	return (
		<Modal size="md" title={title} description={description} isOpen={isOpen} onClose={onClose}>
			<Image name={image} className="mt-8 w-full" />
		</Modal>
	);
};

VerifyMessageStatus.defaultProps = {
	isOpen: false,
	type: "success",
};
