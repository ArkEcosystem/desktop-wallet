import { images } from "app/assets/images";
import { Modal } from "app/components/Modal";
import { Spinner } from "app/components/Spinner";
import { useLedgerContext } from "app/contexts/Ledger/Ledger";
import React, { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

const { WaitingLedgerDevice } = images.wallet.components.Ledger;

export const LedgerWaitingDevice = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: (hasDeviceAvailable: boolean) => void;
}) => {
	const { t } = useTranslation();
	const { hasDeviceAvailable } = useLedgerContext();

	useLayoutEffect(() => {
		if (hasDeviceAvailable) {
			onClose(true);
		}
	}, [hasDeviceAvailable, onClose]);

	return (
		<Modal title={t("WALLETS.MODAL_LEDGER_WALLET.TITLE")} isOpen={isOpen} onClose={() => onClose(false)}>
			<div className="mt-8 text-center text-theme-neutral-dark" data-testid="LedgerWaitingDevice-description">
				{t("WALLETS.MODAL_LEDGER_WALLET.CONNECT_DEVICE")}
			</div>
			<WaitingLedgerDevice className="mx-auto my-8" />
			<div className="inline-flex items-center justify-center w-full mt-8 space-x-3">
				<Spinner color="primary" />
				<span className="text-theme-text" data-testid="LedgerWaitingDevice-loading_message">
					{t("WALLETS.MODAL_LEDGER_WALLET.WAITING_DEVICE")}
				</span>
			</div>
		</Modal>
	);
};
