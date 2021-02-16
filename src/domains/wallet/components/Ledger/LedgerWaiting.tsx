import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import { Spinner } from "app/components/Spinner";
import { useLedgerContext } from "app/contexts/Ledger/Ledger";
import React, { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

export const LedgerWaiting = ({
	isOpen,
	subject,
	coinName,
	onClose,
}: {
	isOpen: boolean;
	subject?: "device" | "app";
	coinName?: string;
	onClose?: (hasDeviceAvailable: boolean) => void;
}) => {
	const { t } = useTranslation();
	const { hasDeviceAvailable } = useLedgerContext();

	useLayoutEffect(() => {
		if (hasDeviceAvailable) {
			onClose?.(true);
		}
	}, [hasDeviceAvailable, onClose]);

	return (
		<Modal title={t("WALLETS.MODAL_LEDGER_WALLET.TITLE")} isOpen={isOpen} onClose={() => onClose?.(false)}>
			<div className="mt-8 space-y-8">
				<div className="text-theme-secondary-700" data-testid="LedgerWaiting-description">
					{t("WALLETS.MODAL_LEDGER_WALLET.CONNECT_DEVICE")}
				</div>

				<Image name="WaitingLedgerDevice" domain="wallet" className="mx-auto" />

				<div className="inline-flex justify-center items-center space-x-3 w-full">
					<Spinner />
					<span
						className="font-semibold animate-pulse text-theme-secondary-text"
						data-testid="LedgerWaiting-loading_message"
					>
						{subject === "device"
							? t("WALLETS.MODAL_LEDGER_WALLET.WAITING_DEVICE")
							: t("WALLETS.MODAL_LEDGER_WALLET.OPEN_APP", { coin: coinName })}
					</span>
				</div>
			</div>
		</Modal>
	);
};

LedgerWaiting.defaultProps = {
	subject: "device",
};
