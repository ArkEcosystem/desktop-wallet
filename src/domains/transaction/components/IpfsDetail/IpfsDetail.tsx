import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
// UI Elements
import { Modal } from "app/components/Modal";
import { TransactionDetail } from "app/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type IpfsDetailProps = {
	isOpen: boolean;
	onClose?: any;
};

export const IpfsDetail = (props: IpfsDetailProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("TRANSACTION.MODAL_IPFS_DETAIL.TITLE")} isOpen={props.isOpen} onClose={props.onClose}>
			<TransactionDetail
				label={t("TRANSACTION.SENDER")}
				border={false}
				extra={
					<div className="flex items-center">
						<Circle className="-mr-2 border-black">
							<Icon name="Delegate" width={25} height={25} />
						</Circle>
						<Avatar address="test" />
					</div>
				}
			>
				ROBank
				<span className="ml-2 text-theme-neutral-500">ADDR...ESSS</span>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<Circle className="border-theme-danger-100 text-theme-danger-400">
						<Icon name="Sent" width={16} height={16} />
					</Circle>
				}
			>
				0.00 ARK
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09812015 ARK</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.IPFS_HASH")}
				extra={
					<Circle className="border-black">
						<Icon name="Ipfs" width={20} height={20} />
					</Circle>
				}
			>
				<div className="flex justify-between">QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco</div>
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

IpfsDetail.defaultProps = {
	isOpen: false,
};

IpfsDetail.displayName = "IpfsDetail";
