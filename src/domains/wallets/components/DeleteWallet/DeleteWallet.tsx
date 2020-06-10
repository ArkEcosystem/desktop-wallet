import React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useForm } from "react-hook-form";
// UI Elements
import { Modal } from "app/components/Modal";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";

import { images } from "app/assets/images";

type DeleteWalletProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDelete: any;
} & WrappedComponentProps;

const DeleteBanner = images.common.DeleteBanner;

export const DeleteWallet = injectIntl(({ intl: { formatMessage }, ...props }: DeleteWalletProps) => {
	const methods = useForm({ mode: "onChange" });

	return (
		<Modal
			title={formatMessage({ id: "WALLET.MODAL_DELETE_WALLET.TITLE" })}
			image={<DeleteBanner className="m-auto w-3/5 mb-8" />}
			description={formatMessage({ id: "WALLET.MODAL_DELETE_WALLET.DESCRIPTION" })}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="flex justify-end mt-8">
				<Button color="primary" variant="plain" onClick={props.onCancel} className="mr-2">
					{formatMessage({ id: "COMMON_CANCEL" })}
				</Button>

				<Button
					type="submit"
					color="primary"
					variant="solid"
					onClick={props.onDelete}
					className="flex items-center"
				>
					<Icon name="Trash" />

					<span className="ml-2">{formatMessage({ id: "COMMON_DELETE" })}</span>
				</Button>
			</div>
		</Modal>
	);
});

DeleteWallet.defaultProps = {
	isOpen: false,
};

DeleteWallet.displayName = "DeleteWallet";
