import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
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

const DeleteBanner = images.common.DeleteBanner;

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
			image={<DeleteBanner className="w-3/5 m-auto mb-8" />}
			description={description}
			isOpen={isOpen}
			onClose={onClose}
		>
			{children && <div className="mt-4">{children}</div>}

			<div className="flex justify-end mt-8 space-x-3">
				<Button color="primary" variant="plain" onClick={onCancel}>
					{t("COMMON.CANCEL")}
				</Button>

				<Button type="submit" color="primary" variant="solid" onClick={onDelete} className="flex items-center">
					<Icon name="Trash" />

					<span className="ml-2">{t("COMMON.DELETE")}</span>
				</Button>
			</div>
		</Modal>
	);
};

DeleteResource.defaultProps = {
	isOpen: false,
};
