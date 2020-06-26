import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import React from "react";
import { useTranslation } from "react-i18next";

type ReceiveFundsProps = {
	isOpen: boolean;
	wallet: any;
	qrCode: string;
	onCopy: () => void;
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
			<div className="flex items-center mt-8 mb-6">
				<div className="flex-1">
					<div className="text-sm font-semibold text-theme-neutral-500">{label}</div>
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

export const ReceiveFunds = ({ isOpen, wallet, qrCode, onCopy, handleClose }: ReceiveFundsProps) => {
	const { t } = useTranslation();

	return (
		<Modal isOpen={isOpen} title={t("WALLETS.MODAL_RECEIVE_FUNDS.TITLE")} onClose={() => handleClose()}>
			{wallet.walletName && (
				<Wrapper label={t("COMMON.WALLET")} value={wallet.walletName}>
					<Circle className="ml-4">
						<Icon name={wallet.coinIcon} />
					</Circle>
				</Wrapper>
			)}

			<Wrapper
				label={t("COMMON.ADDRESS")}
				value={wallet.address}
				copyButton={
					<button onClick={onCopy} className="inline-block ml-4 text-theme-primary-300">
						<Icon name="Copy" />
					</button>
				}
			>
				<div className="ml-4">
					{!wallet.walletName && (
						<Circle className="-mr-2">
							<Icon name={wallet.coinIcon} />
						</Circle>
					)}
					<Circle avatarId={wallet.avatarId} />
				</div>
			</Wrapper>

			<div className="mt-8">
				<img src={qrCode} className="w-64 h-64 mx-auto" />
			</div>
		</Modal>
	);
};

ReceiveFunds.defaultProps = {
	isOpen: false,
	wallet: {},
};
