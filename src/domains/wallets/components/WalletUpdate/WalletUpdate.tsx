// Packages
// Assets
import { images } from "app/assets/images";
// Components
import { Button } from "app/components/Button";
import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type WalletUpdateProps = {
	isOpen: boolean;
	isUpdate: boolean;
	isReady: boolean;
	onClose?: any;
	onCancel?: any;
	onUpdate: any;
	onInstall?: any;
};

const { WalletUpdateBanner, WalletUpdateReadyBanner } = images.wallet.components.walletUpdate;

export const WalletUpdate = ({
	isOpen,
	isUpdate,
	isReady,
	onClose,
	onCancel,
	onUpdate,
	onInstall,
}: WalletUpdateProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			title={t("WALLETS.MODAL_WALLET_UPDATE.TITLE", { version: "3.0.7" })}
			image={isReady ? <WalletUpdateReadyBanner className="my-10" /> : <WalletUpdateBanner className="my-10" />}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="container">
				{!isUpdate && !isReady ? (
					<>
						<div className="mb-6 text-center">
							<p className="text-sm text-theme-neutral-dark md:text-base">
								{t("WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_1")}
							</p>
						</div>
						<div className="flex flex-col justify-center space-x-0 sm:flex-row sm:space-x-3">
							<Button
								color="primary"
								variant="solid"
								onClick={onUpdate}
								data-testid="wallet-update__update-button"
							>
								{t("COMMON.UPDATE_NOW")}
							</Button>
							<Button
								color="primary"
								variant="plain"
								className="mt-2 sm:mt-0"
								onClick={onCancel}
								data-testid="wallet-update__cancel-button"
							>
								{t("COMMON.UPDATE_LATER")}
							</Button>
						</div>
					</>
				) : (
					!isReady && (
						<div className="flex w-2/5 mx-auto">
							<div className="flex-1">
								<p className="text-sm font-semibold text-theme-neutral-light">
									{t("COMMON.DOWNLOADED")}
								</p>
								<p className="text-sm font-bold text-theme-neutral-dark">154 KB / 154 KB</p>
							</div>
							<div className="flex-1">
								<div className="flex justify-center">
									<CircularProgressBar value={78} size={50} strokeWidth={5} fontSize={0.8} />
								</div>
							</div>
						</div>
					)
				)}

				{isReady && (
					<>
						<div className="mb-6 text-center">
							<p className="text-sm text-theme-neutral-dark md:text-base">
								{t("WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_2")}
							</p>
						</div>
						<div className="flex justify-center">
							<Button
								color="primary"
								variant="solid"
								onClick={onInstall}
								data-testid="wallet-update__install-button"
							>
								{t("COMMON.INSTALL")}
							</Button>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
};

WalletUpdate.defaultProps = {
	isOpen: false,
	isUpdate: false,
	isReady: false,
};
