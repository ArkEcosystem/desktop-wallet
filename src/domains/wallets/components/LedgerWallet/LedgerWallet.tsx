import { images } from "app/assets/images";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type LedgerWalletProps = {
	isOpen: boolean;
	onClose?: any;
};

const { WaitingLedger } = images.wallet.components.LedgerWallet;

export const LedgerWallet = ({ isOpen, onClose }: LedgerWalletProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("WALLETS.MODAL_LEDGER_WALLET.TITLE")} isOpen={isOpen} onClose={onClose}>
			<div className="container">
				<p className="text-sm text-theme-neutral-dark md:text-base">
					{t("WALLETS.MODAL_LEDGER_WALLET.DESCRIPTION")}
				</p>
				<WaitingLedger className="my-8" />
			</div>
		</Modal>
	);
};

LedgerWallet.defaultProps = {
	isOpen: false,
};
