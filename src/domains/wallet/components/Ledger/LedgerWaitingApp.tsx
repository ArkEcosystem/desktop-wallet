import { Header } from "app/components/Header";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import { Spinner } from "app/components/Spinner";
import React from "react";
import { useTranslation } from "react-i18next";

export const LedgerWaitingAppContent = ({ coinName }: { coinName: string }) => {
	const { t } = useTranslation();

	return (
		<div className="mt-8 space-y-8">
			<Header
				title={t("WALLETS.MODAL_LEDGER_WALLET.TITLE")}
				subtitle={t("WALLETS.MODAL_LEDGER_WALLET.CONNECT_DEVICE")}
			/>

			<Image name="WaitingLedgerDevice" domain="wallet" className="mx-auto" />

			<div className="inline-flex items-center space-x-3 w-full">
				<Spinner />
				<span
					className="font-semibold animate-pulse text-theme-secondary-text"
					data-testid="LedgerWaitingApp-loading_message"
				>
					{t("WALLETS.MODAL_LEDGER_WALLET.OPEN_APP", { coin: coinName })}
				</span>
			</div>
		</div>
	);
};

export const LedgerWaitingApp = ({
	isOpen,
	coinName,
	onClose,
}: {
	isOpen: boolean;
	coinName: string;
	onClose?: () => void;
}) => (
	<Modal title={""} isOpen={isOpen} onClose={() => onClose?.()}>
		<LedgerWaitingAppContent coinName={coinName} />
	</Modal>
);
