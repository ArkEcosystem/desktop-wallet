import { images } from "app/assets/images";
import { Modal } from "app/components/Modal";
import { Spinner } from "app/components/Spinner";
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
				<div className="inline-flex items-center space-x-4">
					<Spinner color="primary" size="default" />
					<span className="font-semibold text-black">
						{t("WALLETS.MODAL_LEDGER_WALLET.WAITING_FOR_LEDGER")}
					</span>
				</div>
			</div>
		</Modal>
	);
};

LedgerWallet.defaultProps = {
	isOpen: false,
};
