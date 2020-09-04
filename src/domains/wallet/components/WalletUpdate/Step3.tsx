import { images } from "app/assets/images";
import React from "react";
import { useTranslation } from "react-i18next";

type WalletUpdateProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

const { WalletUpdateBanner, WalletUpdateReadyBanner } = images.wallet.components.walletUpdate;

export const ThirdStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="WalletUpdate__third-step">
			<div className="mb-6 text-center">
				<p className="text-sm text-theme-neutral-dark md:text-base">
					{t("WALLETS.MODAL_WALLET_UPDATE.DESCRIPTION_2")}
				</p>
			</div>
		</section>
	);
};
