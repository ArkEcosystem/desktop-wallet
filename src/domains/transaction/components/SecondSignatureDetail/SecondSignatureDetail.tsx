import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import { TransactionDetail } from "app/components/TransactionDetail";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import React from "react";
import { useTranslation } from "react-i18next";

type SecondSignatureDetailProps = {
	isOpen: boolean;
	transaction?: any;
	ticker?: string;
	walletAlias?: string;
	onClose?: any;
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

export const SecondSignatureDetail = (props: SecondSignatureDetailProps) => {
	const { t } = useTranslation();

	const renderSender = () => {
		if (props.walletAlias) {
			return (
				<TransactionDetail
					label={t("TRANSACTION.SENDER")}
					extra={
						<div className="flex items-center">
							<Circle className="-mr-2 border-black">
								<Icon name="Delegate" width={25} height={25} />
							</Circle>
							<Avatar address={props.transaction.sender()} />
						</div>
					}
					border={false}
				>
					{props.walletAlias}
					<TruncateMiddle text={props.transaction.sender()} className="ml-2 text-theme-neutral" />
				</TransactionDetail>
			);
		}

		return (
			<TransactionDetail
				label={t("TRANSACTION.SENDER")}
				extra={
					<div className="flex items-center">
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Avatar address={props.transaction.sender()} />
					</div>
				}
				border={false}
			>
				<TruncateMiddle text={props.transaction.sender()} className="text-theme-neutral" />
			</TransactionDetail>
		);
	};

	return (
		<Modal
			title={t("TRANSACTION.MODAL_SECOND_SIGNATURE_DETAIL.TITLE")}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			{renderSender()}

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>
				{`${props.transaction.fee().toHuman()} ${props.ticker?.toUpperCase()}`}
			</TransactionDetail>

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

SecondSignatureDetail.defaultProps = {
	isOpen: false,
};
