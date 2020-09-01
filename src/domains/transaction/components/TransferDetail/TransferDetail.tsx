// import { Contracts } from "@arkecosystem/platform-sdk";

import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { Modal } from "app/components/Modal";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TruncateMiddle } from "app/components/TruncateMiddle";
// UI Elements
import React from "react";
import { useTranslation } from "react-i18next";

type TransferDetailProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	transaction: any;
	ticker?: string;
	walletAlias?: string;
};

const renderConfirmationStatus = (isConfirmed: boolean) => {
	if (!isConfirmed) {
		return (
			<div className="flex">
				Not Confirmed
				<div className="flex w-6 h-6 ml-2 rounded-full bg-theme-danger-200 text-theme-danger-500">
					<div className="m-auto">
						<Icon name="CrossSlim" width={12} height={12} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex">
			Well Confirmed
			<div className="flex w-6 h-6 ml-2 rounded-full bg-theme-success-200 text-theme-success-500">
				<div className="m-auto">
					<Icon name="Checkmark" width={15} height={15} />
				</div>
			</div>
		</div>
	);
};

export const TransferDetail = (props: TransferDetailProps) => {
	const { t } = useTranslation();

	const renderRecipient = () => {
		if (props.walletAlias) {
			return (
				<TransactionDetail
					label={t("TRANSACTION.RECIPIENT")}
					extra={
						<div className="flex items-center">
							<Circle className="-mr-2 border-black">
								<Icon name="Delegate" width={25} height={25} />
							</Circle>
							<Avatar address={props.transaction.recipient()} />
						</div>
					}
				>
					{props.walletAlias}
					<TruncateMiddle text={props.transaction.recipient()} className="ml-2 text-theme-neutral" />
				</TransactionDetail>
			);
		}

		return (
			<TransactionDetail
				label={t("TRANSACTION.RECIPIENT")}
				extra={
					<div className="flex items-center">
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Avatar address={props.transaction.recipient()} />
					</div>
				}
			>
				<TruncateMiddle text={props.transaction.recipient()} className="text-theme-neutral" />
			</TransactionDetail>
		);
	};

	const renderAmount = () => {
		if (props.transaction.isSent()) {
			return (
				<TransactionDetail
					label={t("TRANSACTION.AMOUNT")}
					extra={
						<Circle className="border-theme-danger-200 text-theme-danger-dark">
							<Icon name="Sent" width={25} height={25} />
						</Circle>
					}
				>
					<Label color="danger">{`${props.transaction
						.amount()
						.toHuman()} ${props.ticker?.toUpperCase()}`}</Label>
				</TransactionDetail>
			);
		}

		return (
			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<Circle className="border-theme-success-200 text-theme-success-dark">
						<Icon name="Received" width={25} height={25} />
					</Circle>
				}
			>
				<Label color="success">{`${props.transaction
					.amount()
					.toHuman()} ${props.ticker?.toUpperCase()}`}</Label>
			</TransactionDetail>
		);
	};

	return (
		<Modal title={t("TRANSACTION.MODAL_TRANSFER_DETAIL.TITLE")} isOpen={props.isOpen} onClose={props.onClose}>
			<TransactionDetail label={t("TRANSACTION.SENDER")} extra={<Avatar address="test" />} border={false}>
				<div className="mt-2 font-semibold">{props.transaction.sender()}</div>
			</TransactionDetail>

			{renderRecipient()}

			{renderAmount()}

			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_FEE")}
			>{`${props.transaction.fee().toHuman()} ${props.ticker?.toUpperCase()}`}</TransactionDetail>

			{props.transaction.memo() && (
				<TransactionDetail label={t("TRANSACTION.SMARTBRIDGE")}>
					<div className="flex justify-between">
						{props.transaction.memo()}
						<Icon name="Smartbridge" width={20} height={20} />
					</div>
				</TransactionDetail>
			)}

			<TransactionDetail label={t("TRANSACTION.TIMESTAMP")}>
				{props.transaction.timestamp()!.format("DD.MM.YYYY HH:mm:ss")}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")}>
				{renderConfirmationStatus(props.transaction.isConfirmed())}
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.ID")}>
				<TruncateMiddle text={props.transaction.id()} className="text-theme-primary-dark" />

				<span className="inline-block ml-4 text-theme-primary-300">
					<Icon name="Copy" />
				</span>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.BLOCK_ID")}>
				<TruncateMiddle text={props.transaction.blockId()} className="text-theme-primary-dark" />

				<span className="inline-block ml-4 text-theme-primary-300">
					<Icon name="Copy" />
				</span>
			</TransactionDetail>
		</Modal>
	);
};

TransferDetail.defaultProps = {
	isOpen: false,
};

TransferDetail.displayName = "TransferDetail";
