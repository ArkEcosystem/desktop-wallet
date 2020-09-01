import { QRCode } from "@arkecosystem/platform-sdk-support";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ReceiveFundsProps = {
	isOpen: boolean;
	name?: string;
	address: string;
	icon: string;
	handleClose?: any;
};

type WrapperProps = {
	label: string;
	value: string;
	className?: string;
	children?: React.ReactNode;
	copyButton?: React.ReactNode;
};

const Wrapper = ({ label, value, className, children, copyButton }: WrapperProps) => (
	<div className={className} data-testid="ReceiveFunds__info">
		<div className="flex items-center mt-6 mb-6">
			<div className="flex-1">
				<div className="text-sm font-semibold text-theme-neutral">{label}</div>
				<div className="flex items-center font-semibold">
					{value}
					{copyButton}
				</div>
			</div>

			{children}
		</div>

		<Divider dashed={true} />
	</div>
);

export const ReceiveFunds = ({ isOpen, name, address, icon, handleClose }: ReceiveFundsProps) => {
	const { t } = useTranslation();

	const [qrCode, setQrCode] = useState<string | undefined>();

	useEffect(() => {
		const fetchQrCode = async () => {
			const qr = address ? await QRCode.fromString(address).toDataURL({ width: 250, margin: 0 }) : undefined;
			setQrCode(qr);
		};

		fetchQrCode();
	}, [address]);

	return (
		<Modal isOpen={isOpen} title={t("WALLETS.MODAL_RECEIVE_FUNDS.TITLE")} onClose={() => handleClose()}>
			<div className="mt-2">
				{name && (
					<Wrapper label={t("COMMON.WALLET")} value={name}>
						<Circle size="lg" className="ml-4">
							<Icon name={icon} />
						</Circle>
					</Wrapper>
				)}
			</div>

			<Wrapper
				label={t("COMMON.ADDRESS")}
				value={address}
				copyButton={
					<span className="ml-4">
						<Clipboard>
							<div className="text-theme-primary-300">
								<Icon name="Copy" />
							</div>
						</Clipboard>
					</span>
				}
			>
				<div className="flex items-center ml-4">
					{!name && (
						<Circle size="lg" className="-mr-2">
							<Icon name={icon} width={20} height={20} />
						</Circle>
					)}
					<Avatar address={address} size="lg" />
				</div>
			</Wrapper>

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
