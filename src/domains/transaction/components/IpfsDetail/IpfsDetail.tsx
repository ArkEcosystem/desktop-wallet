import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import {
	TransactionConfirmations,
	TransactionDetail,
	TransactionExplorerLink,
	TransactionFee,
	TransactionSender,
	TransactionTimestamp,
} from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type IpfsDetailProps = {
	isOpen: boolean;
	senderWallet?: ReadWriteWallet;
	transaction: any;
	wallet: any;
	onClose?: any;
};

export const IpfsDetail = ({
	isOpen,
	senderWallet,
	transaction,
	wallet,
	onClose,
}: IpfsDetailProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("TRANSACTION.MODAL_IPFS_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				wallet={senderWallet}
				border={false}
			/>

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			<TransactionDetail
				label={t("TRANSACTION.IPFS_HASH")}
				extra={
					<Circle className="border-theme-text" size="lg">
						<Icon name="Ipfs" width={21} height={23} />
					</Circle>
				}
			>
				{transaction.hash()}
			</TransactionDetail>

			<TransactionTimestamp timestamp={transaction.timestamp()} />

			<TransactionConfirmations
				isConfirmed={transaction.isConfirmed()}
				confirmations={transaction.confirmations()}
			/>

			<TransactionExplorerLink id={transaction.id()} link={transaction.explorerLink()} />

			{transaction.blockId() && (
				<TransactionExplorerLink
					id={transaction.blockId()}
					link={transaction.explorerLinkForBlock()}
					variant="block"
				/>
			)}
		</Modal>
	);
};

IpfsDetail.defaultProps = {
	isOpen: false,
};

IpfsDetail.displayName = "IpfsDetail";
