import { QRCode } from "@arkecosystem/platform-sdk-support";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ReceiveFundsProps = {
	address: string;
	icon: string;
	name?: string;
	isOpen: boolean;
	onClose?: () => void;
};

export const ReceiveFunds = ({ address, icon, name, isOpen, onClose }: ReceiveFundsProps) => {
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
		<Modal title={t("WALLETS.MODAL_RECEIVE_FUNDS.TITLE")} size="lg" isOpen={isOpen} onClose={onClose}>
			{name && (
				<div data-testid="ReceiveFunds__info">
					<TransactionDetail
						borderPosition="bottom"
						label={t("COMMON.WALLET")}
						extra={
							<Circle size="lg" className="ml-4">
								<Icon name={icon} width={20} height={20} />
							</Circle>
						}
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
						<>
							{!name && (
								<Circle size="lg" className="-mr-2">
									<Icon name={icon} width={20} height={20} />
								</Circle>
							)}
							<Avatar address={address} size="lg" />
						</>
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
