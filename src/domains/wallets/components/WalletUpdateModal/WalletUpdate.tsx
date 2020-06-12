// Packages
import React from "react";
import { useTranslation } from "react-i18next";

// Components
import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";

// Assets
import { images } from "app/assets/images";

type WalletUpdateProps = {
	isOpen: boolean;
	isUpdate: boolean;
	isDone: boolean;
	onClose?: any;
	onCancel?: any;
	onUpdate: any;
};

const { WalletUpdateBanner, WalletUpdateReadyBanner } = images.wallet.components.walletUpdate;

export const WalletUpdate = (props: WalletUpdateProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("WALLETS.MODAL_WALLET_UPDATE.TITLE", { version: "3.0.7" })}
			image={<WalletUpdateBanner className="my-10" />}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="container">
				<div className="mb-6 text-center">
					<p className="mb-1 text-sm text-theme-neutral-dark md:text-base">
						{t("WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_1")}
					</p>
				</div>

				<div className="flex flex-col justify-center sm:flex-row">
					<Button color="primary" variant="solid" className="mr-2" onClick={props.onUpdate}>
						{t("COMMON.UPDATE_NOW")}
					</Button>
					<Button color="primary" variant="plain" className="mt-2 sm:mt-0" onClick={props.onCancel}>
						{t("COMMON.UPDATE_LATER")}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

WalletUpdate.defaultProps = {
	isOpen: false,
	isUpdate: false,
	isDone: false,
};
