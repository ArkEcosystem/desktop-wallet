import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Label } from "app/components/Label";
// UI Elements
import { Modal } from "app/components/Modal";
import { TransactionDetail } from "app/components/TransactionDetail";
import { Recipient } from "domains/transaction/components/Recipient";
import React from "react";
import { useTranslation } from "react-i18next";

type MultiPaymentDetailProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

export const MultiPaymentDetail = (props: MultiPaymentDetailProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("TRANSACTION.MODAL_TRANSFER_DETAIL.TITLE")} isOpen={props.isOpen} onClose={props.onClose}>
			<TransactionDetail
				label={t("TRANSACTION.SENDER")}
				extra={
					<div>
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Circle avatarId="test"></Circle>
					</div>
				}
				border={false}
			>
				ROBank
				<span className="ml-2 text-theme-neutral-500">ADDR...ESSS</span>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.RECIPIENTS")} className="last:pb-0">
				<div className="flex justify-between text-sm font-semibold text-theme-neutral-500">
					<div className="ml-12">{t("COMMON.ADDRESS")}</div>
					<div className="ml-12">{t("TRANSACTION.AMOUNT")}</div>
				</div>

				<Recipient address="ADDR...ESSS" amount="-88.84557 ARK" border={false} className="pt-2" />
				<Recipient address="ADDR...ESSS" amount="-88.84557 ARK" />
				<Recipient address="ADDR...ESSS" amount="-88.84557 ARK" />
				<Recipient address="ADDR...ESSS" amount="-88.84557 ARK" className="pb-0" />
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.TOTAL_AMOUNT")}
				extra={
					<Circle className="-mr-2 border-theme-danger-100 text-theme-danger-400">
						<Icon name="Sent" width={40} height={40} />
					</Circle>
				}
			>
				<Label color="danger">2,088.84557 ARK</Label>

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

MultiPaymentDetail.defaultProps = {
	isOpen: false,
};

MultiPaymentDetail.displayName = "MultiPaymentDetail";
