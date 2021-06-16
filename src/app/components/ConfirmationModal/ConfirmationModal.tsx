import { Button } from "app/components/Button";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";
import { Size } from "types";

interface Props {
	isOpen?: boolean;
	description?: string;
	title?: string;
	onCancel?: () => void;
	onConfirm?: () => void;
	size?: Size;
}

export const ConfirmationModal = ({ description, title, size, isOpen, onCancel, onConfirm }: Props) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={title || t("COMMON.CONFIRMATION_MODAL.TITLE")}
			titleClass="text-theme-text"
			image={<Image name="GenericWarning" className="m-auto my-8 w-3/5" />}
			description={description || t("COMMON.CONFIRMATION_MODAL.DESCRIPTION")}
			size={size}
			isOpen={isOpen}
			onClose={onCancel}
		>
			<div data-testid="ConfirmationModal">
				<div className="flex justify-end mt-8 space-x-3">
					<Button variant="secondary" onClick={onCancel} data-testid="ConfirmationModal__no-button">
						{t("COMMON.NO")}
					</Button>

					<Button
						type="button"
						onClick={onConfirm}
						variant="primary"
						data-testid="ConfirmationModal__yes-button"
					>
						<span>{t("COMMON.YES")}</span>
					</Button>
				</div>
			</div>
		</Modal>
	);
};

ConfirmationModal.defaultProps = {
	isOpen: false,
	size: "lg",
};
