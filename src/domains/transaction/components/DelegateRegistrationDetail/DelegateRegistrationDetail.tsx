import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
// UI Elements
import { Modal } from "app/components/Modal";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type DelegateRegistrationDetailProps = {
	isOpen: boolean;
	onClose?: any;
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

export const DelegateRegistrationDetail = (props: DelegateRegistrationDetailProps) => {
	const { t } = useTranslation();

	const renderAmount = () => (
		<TransactionDetail
			label={t("TRANSACTION.AMOUNT")}
			extra={
				<Circle className="border-theme-danger-200 text-theme-danger-dark">
					<Icon name="Sent" width={25} height={25} />
				</Circle>
			}
		>
			<Label color="danger">{`${props.transaction.total().toHuman()} ${props.ticker?.toUpperCase()}`}</Label>
		</TransactionDetail>
	);

	return (
		<Modal
			title={t("TRANSACTION.MODAL_DELEGATE_REGISTRATION_DETAIL.TITLE")}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<TransactionDetail
				label={t("TRANSACTION.ACCOUNT")}
				extra={
					<div className="flex items-center">
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Avatar address={props.transaction.recipient()} />
					</div>
				}
				border={false}
			>
				{props.transaction.username()}
				<TruncateMiddle text={props.transaction.recipient()} className="ml-2 text-theme-neutral" />
			</TransactionDetail>

			{renderAmount()}

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

DelegateRegistrationDetail.defaultProps = {
	isOpen: false,
};

DelegateRegistrationDetail.displayName = "DelegateRegistrationDetail";
