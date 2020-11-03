import { QRCode } from "@arkecosystem/platform-sdk-support";
import { Avatar } from "app/components/Avatar";
import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ReceiveFundsProps = {
	address: string;
	icon: string;
	name?: string;
	network: string;
	isOpen: boolean;
	onClose?: () => void;
};

export const ReceiveFunds = ({ address, icon, name, network, isOpen, onClose }: ReceiveFundsProps) => {
	const { t } = useTranslation();

	const [qrCode, setQrCode] = useState<string | undefined>();

	useEffect(() => {
		const fetchQrCode = async () => {
			if (!isOpen) return;
			const qr = address ? await QRCode.fromString(address).toDataURL({ width: 250, margin: 0 }) : undefined;
			setQrCode(qr);
		};

		fetchQrCode();
	}, [address, isOpen]);

	return (
		<Modal title={t("WALLETS.MODAL_RECEIVE_FUNDS.TITLE")} isOpen={isOpen} onClose={onClose}>
			{name && (
				<div data-testid="ReceiveFunds__info">
					<TransactionDetail
						borderPosition="bottom"
						label={t("COMMON.WALLET")}
						extra={<NetworkIcon size="lg" coin={icon} network={network} />}
					>
						{name}
					</TransactionDetail>
				</div>
			)}

			<div data-testid="ReceiveFunds__info">
				<TransactionDetail
					label={t("COMMON.ADDRESS")}
					borderPosition="bottom"
					extra={
						<div className="-space-x-2">
							{!name && <NetworkIcon size="lg" coin={icon} network={network} />}
							<Avatar address={address} size="lg" />
						</div>
					}
				>
					<div className="flex items-center space-x-3">
						<span>{address}</span>
						<span className="flex text-theme-primary-300 dark:text-theme-neutral-600">
							<Clipboard data={address}>
								<Icon name="Copy" />
							</Clipboard>
						</span>
					</div>
				</TransactionDetail>
			</div>

			<div className="mt-8">
				{qrCode && (
					<img
						src={qrCode}
						className="w-64 h-64 mx-auto"
						alt={t("COMMON.QR_CODE")}
						data-testid="ReceiveFunds__qrcode"
					/>
				)}
			</div>
		</Modal>
	);
};

ReceiveFunds.defaultProps = {
	isOpen: false,
};
