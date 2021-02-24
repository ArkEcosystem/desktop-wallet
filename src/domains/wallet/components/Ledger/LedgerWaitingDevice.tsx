import { Header } from "app/components/Header";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import { Spinner } from "app/components/Spinner";
import { useLedgerContext } from "app/contexts/Ledger/Ledger";
import React, { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

export const LedgerWaitingDeviceContent = () => {
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
					data-testid="LedgerWaitingDevice-loading_message"
				>
					{t("WALLETS.MODAL_LEDGER_WALLET.WAITING_DEVICE")}
				</span>
			</div>
		</div>
	);
};

export const LedgerWaitingDevice = ({
	isOpen,
	coinName,
	onClose,
	onDeviceAvailable,
}: {
	isOpen: boolean;
	coinName?: string;
	onClose?: () => void;
	onDeviceAvailable?: (hasDeviceAvailable: boolean) => void;
}) => {
	const { hasDeviceAvailable } = useLedgerContext();

	useLayoutEffect(() => {
		if (hasDeviceAvailable) {
			onDeviceAvailable?.(true);
		}
	}, [hasDeviceAvailable, onDeviceAvailable]);

	return (
		<Modal title={""} isOpen={isOpen} onClose={() => onClose?.()}>
			<LedgerWaitingDeviceContent />
		</Modal>
	);
};
