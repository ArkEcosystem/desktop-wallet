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
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface TransferDetailProperties {
	isOpen: boolean;
	transaction: any;
	onClose?: any;
}

export const TransferDetail = ({ isOpen, transaction, onClose }: TransferDetailProperties) => {
	const { t } = useTranslation();

	const wallet = useMemo(() => transaction.wallet(), [transaction]);

	return (
		<Modal title={t("TRANSACTION.MODAL_TRANSFER_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				alias={wallet.alias()}
				isDelegate={wallet.isDelegate() && !wallet.isResignedDelegate()}
				border={false}
			/>

			<TransactionRecipients currency={wallet.currency()} recipients={[{ address: transaction.recipient() }]} />

			<TransactionAmount
				amount={transaction.amount()}
				convertedAmount={transaction.convertedAmount()}
				currency={wallet.currency()}
				exchangeCurrency={wallet.exchangeCurrency()}
				isSent={transaction.isSent()}
			/>

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			{transaction.memo() && <TransactionMemo memo={transaction.memo()} />}

			<TransactionTimestamp timestamp={transaction.timestamp()} />

			<TransactionConfirmations
				isConfirmed={transaction.isConfirmed()}
				confirmations={transaction.confirmations()}
			/>

			<TransactionExplorerLink transaction={transaction} />
		</Modal>
	);
};

TransferDetail.defaultProps = {
	isOpen: false,
};

TransferDetail.displayName = "TransferDetail";
