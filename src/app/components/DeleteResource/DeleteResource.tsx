import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type DeleteResourceProps = {
	isOpen: boolean;
	title: string;
	description?: string;
	children?: React.ReactNode;
	onClose?: any;
	onCancel?: any;
	onDelete: any;
};

export const DeleteResource = ({
	isOpen,
	title,
	description,
	children,
	onClose,
	onCancel,
	onDelete,
}: DeleteResourceProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={title}
			image={<Image name="DeleteBanner" className="w-64 mx-auto my-8" />}
			description={description}
			size="lg"
			isOpen={isOpen}
			onClose={onClose}
		>
			{children && <div className="mt-4">{children}</div>}

			<div className="flex justify-end mt-8 space-x-3">
				<Button variant="plain" onClick={onCancel} data-testid="DeleteResource__cancel-button">
					{t("COMMON.CANCEL")}
				</Button>

				<Button type="submit" onClick={onDelete} data-testid="DeleteResource__submit-button">
					<Icon name="Trash" />
					<span>{t("COMMON.DELETE")}</span>
				</Button>
			</div>
		</Modal>
	);
};

DeleteResource.defaultProps = {
	isOpen: false,
};
