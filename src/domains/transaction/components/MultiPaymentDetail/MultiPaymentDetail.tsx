import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import {
	TransactionAmount,
	TransactionConfirmations,
	TransactionExplorerLink,
	TransactionFee,
	TransactionMemo,
	TransactionRecipients,
	TransactionSender,
	TransactionTimestamp,
} from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type MultiPaymentDetailProps = {
	isOpen: boolean;
	senderWallet?: ReadWriteWallet;
	transaction: any;
	wallet: any;
	onClose?: any;
};

export const MultiPaymentDetail = ({
	isOpen,
	senderWallet,
	transaction,
	wallet,
	onClose,
}: MultiPaymentDetailProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("TRANSACTION.MODAL_TRANSFER_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				wallet={senderWallet}
				border={false}
			/>

			<TransactionRecipients currency={wallet.currency()} recipients={transaction.recipients()} />

			<TransactionAmount
				amount={transaction.amount()}
				convertedAmount={transaction.convertedAmount()}
				currency={wallet.currency()}
				exchangeCurrency={wallet.exchangeCurrency()}
				isMultiPayment={true}
				isSent={transaction.isSent()}
			/>

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			{transaction.memo() && <TransactionMemo memo={transaction.memo()} />}

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

MultiPaymentDetail.defaultProps = {
	isOpen: false,
};

MultiPaymentDetail.displayName = "MultiPaymentDetail";
