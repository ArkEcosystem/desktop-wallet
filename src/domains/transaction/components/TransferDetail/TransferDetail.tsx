import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
// UI Elements
import { Modal } from "app/components/Modal";
import { TransactionDetail } from "app/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type TransferDetailProps = {
	isOpen: boolean;
	onClose?: any;
};

export const TransferDetail = (props: TransferDetailProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("TRANSACTION.MODAL_TRANSFER_DETAIL.TITLE")} isOpen={props.isOpen} onClose={props.onClose}>
			<TransactionDetail label={t("TRANSACTION.SENDER")} extra={<Circle avatarId="test" />} border={false}>
				<div className="mt-2 font-semibold">ADDRESS</div>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.RECIPIENT")}
				extra={
					<div>
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Circle avatarId="test" />
					</div>
				}
			>
				ROBank
				<span className="ml-2 text-theme-neutral-500">ADDR...ESSS</span>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<Circle className="border-theme-success-200 text-theme-success-700">
						<Icon name="Received" width={40} height={40} />
					</Circle>
				}
			>
				<Label color="success">2,088.84557 ARK</Label>

				<span className="ml-2 text-theme-neutral-500">23,000.00 USD</span>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09812015 ARK</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.SMARTBRIDGE")}>
				<div className="flex justify-between">
					Hello!
					<Icon name="Smartbridge" width={20} height={20} />
				</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TIMESTAMP")}>14.04.2020 21:42:40</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")}>
				<div className="flex">
					Well Confirmed
					<div className="flex w-6 h-6 ml-2 rounded-full bg-theme-success-200 text-theme-success-500">
						<div className="m-auto">
							<Icon name="Checkmark" width={15} height={15} />
						</div>
					</div>
				</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.ID")}>
				<span className="text-theme-primary-700">1234678...12312313</span>

				<span className="inline-block ml-4 text-theme-primary-300">
					<Icon name="Copy" />
				</span>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.BLOCK_ID")}>
				<span className="text-theme-primary-700">1234678...12312313</span>

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
