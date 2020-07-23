import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type ReceiveFundsProps = {
	isOpen: boolean;
	wallet: any;
	qrCode?: string;
	handleClose?: any;
};

type WrapperProps = {
	label: string;
	value: string;
	className?: string;
	children?: React.ReactNode;
	copyButton?: React.ReactNode;
};

const Wrapper = ({ label, value, className, children, copyButton }: WrapperProps) => {
	return (
		<div className={className}>
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
};

export const ReceiveFunds = ({ isOpen, wallet, qrCode, handleClose }: ReceiveFundsProps) => {
	const { t } = useTranslation();

	return (
		<Modal isOpen={isOpen} title={t("WALLETS.MODAL_RECEIVE_FUNDS.TITLE")} onClose={() => handleClose()}>
			<div className="mt-2">
				{wallet.walletName && (
					<Wrapper label={t("COMMON.WALLET")} value={wallet.walletName}>
						<Circle className="ml-4">
							<Icon name={wallet.coinIcon} />
						</Circle>
					</Wrapper>
				)}
			</div>

			<Wrapper
				label={t("COMMON.ADDRESS")}
				value={wallet.address}
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
				<div className="flex items-center mb-2 ml-4">
					{!wallet.walletName && (
						<Circle className="-mr-2">
							<Icon name={wallet.coinIcon} />
						</Circle>
					)}
					<Avatar address={wallet.address} />
				</div>
			</Wrapper>

			<div className="mt-8">
				<img src={qrCode} className="w-64 h-64 mx-auto" alt={t("COMMON.QR_CODE")} />
			</div>
		</Modal>
	);
};

ReceiveFunds.defaultProps = {
	isOpen: false,
	wallet: {},
};
