import React from "react";
import { useTranslation } from "react-i18next";
// UI Elements
import { Modal } from "app/components/Modal";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
import { TransactionDetail } from "app/components/TransactionDetail";

type TransferDetailProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onDelete: any;
};

export const TransferDetail = (props: TransferDetailProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("TRANSACTION.MODAL_TRANSFER_DETAIL.TITLE")} isOpen={props.isOpen} onClose={props.onClose}>
			<TransactionDetail label="Sender" extra={<Circle avatarId="test"></Circle>} border={false}>
				<div className="mt-2 font-semibold">ADDRESS</div>
			</TransactionDetail>

			<TransactionDetail
				label="Recipient"
				extra={
					<div>
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Circle avatarId="test"></Circle>
					</div>
				}
			>
				ROBank
				<span className="text-theme-neutral-500 ml-2">ADDR...ESSS</span>
			</TransactionDetail>

			<TransactionDetail
				label="Amount"
				extra={
					<Circle className="border-theme-success-200 text-theme-success-700 -mr-2">
						<Icon name="Received" width={40} height={40} />
					</Circle>
				}
			>
				<Label color="success">2,088.84557 ARK</Label>

				<span className="text-theme-neutral-500 ml-2">23,000.00 USD</span>
			</TransactionDetail>

			<TransactionDetail label="Transaction Fee">0.09812015 ARK</TransactionDetail>

			<TransactionDetail label="Smartbridge">
				<div className="flex justify-between">
					Hello!
					<Icon name="Smartbridge" width={20} height={20} />
				</div>
			</TransactionDetail>

			<TransactionDetail label="Timestamp">14.04.2020 21:42:40</TransactionDetail>

			<TransactionDetail label="Confirmations">
				<div className="flex">
					Well Confirmed
					<div className="bg-theme-success-200 text-theme-success-500 flex w-6 h-6 ml-2 rounded-full">
						<div className="m-auto">
							<Icon name="Checkmark" width={15} height={15} />
						</div>
					</div>
				</div>
			</TransactionDetail>

			<TransactionDetail label="ID">
				<span className="text-theme-primary-700">1234678...12312313</span>

				<span className="text-theme-primary-300 inline-block ml-4">
					<Icon name="Copy" />
				</span>
			</TransactionDetail>

			<TransactionDetail label="Block ID">
				<span className="text-theme-primary-700">1234678...12312313</span>

				<span className="text-theme-primary-300 inline-block ml-4">
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
