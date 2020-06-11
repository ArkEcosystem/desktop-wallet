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
			<TransactionDetail title="Sender" extra={<Circle avatarId="test"></Circle>} border={false}>
				<div className="font-semibold mt-2">ADDRESS</div>
			</TransactionDetail>

			<TransactionDetail
				title="Recipient"
				extra={
					<div>
						<Circle className="border-black -mr-2">
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
				title="Amount"
				extra={
					<Circle className="border-theme-success-200 text-theme-success-700 -mr-2">
						<Icon name="Received" width={40} height={40} />
					</Circle>
				}
			>
				<Label color="success">2,088.84557 ARK</Label>

				<span className="text-theme-neutral-500 ml-2">23,000.00 USD</span>
			</TransactionDetail>

			<TransactionDetail title="Transaction Fee">0.09812015 ARK</TransactionDetail>

			<TransactionDetail title="Smartbridge">
				<div className="flex justify-between">
					Hello!
					<Icon name="Smartbridge" width={20} height={20} />
				</div>
			</TransactionDetail>

			<TransactionDetail title="Timestamp">14.04.2020 21:42:40</TransactionDetail>

			<TransactionDetail title="Confirmations">
				<div className="flex">
					Well Confirmed
					<div className="flex w-6 h-6 bg-theme-success-200 text-theme-success-500 rounded-full ml-2">
						<div className="m-auto">
							<Icon name="Checkmark" width={15} height={15} />
						</div>
					</div>
				</div>
			</TransactionDetail>

			<TransactionDetail title="ID">
				<span className="text-theme-primary-700">1234678...12312313</span>

				<span className="inline-block text-theme-primary-300 ml-4">
					<Icon name="Copy" />
				</span>
			</TransactionDetail>

			<TransactionDetail title="Block ID">
				<span className="text-theme-primary-700">1234678...12312313</span>

				<span className="inline-block text-theme-primary-300 ml-4">
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
