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

type MultiPaymentDetailProps = {
	isOpen: boolean;
	ticker?: string;
	transaction: any;
	walletAlias?: string;
	onClose?: any;
};

export const MultiPaymentDetail = ({ isOpen, transaction, walletAlias, onClose }: MultiPaymentDetailProps) => {
	const { t } = useTranslation();

	const wallet = useMemo(() => transaction.wallet(), [transaction]);

	const currency = useMemo(() => wallet.currency() || "", [wallet]);
	const exchangeCurrency = useMemo(() => wallet.exchangeCurrency() || "", [wallet]);

	return (
		<Modal title={t("TRANSACTION.MODAL_TRANSFER_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				alias={wallet.alias()}
				isDelegate={wallet.isDelegate && !wallet.isResignedDelegate()}
			/>

			<TransactionRecipients currency={currency} recipients={transaction.recipients()} />

			<TransactionAmount
				amount={transaction.amount()}
				convertedAmount={transaction.convertedAmount()}
				currency={currency}
				exchangeCurrency={exchangeCurrency}
				isMultiPayment={true}
				isSent={transaction.isSent()}
			/>

			<TransactionFee currency={currency} value={transaction.fee()} />

			<TransactionMemo memo={transaction.memo()} />

			<TransactionTimestamp timestamp={transaction.timestamp()} />

			<TransactionConfirmations
				isConfirmed={transaction.isConfirmed()}
				confirmations={transaction.confirmations().toNumber()}
			/>

			<TransactionExplorerLink id={transaction.id()} link={transaction.explorerLink()} />

			{/* @TODO uncomment after SDK bump

			{transaction.blockId() && (
				<TransactionExplorerLink id={transaction.blockId()} link={transaction.explorerBlockLink()} variant="block" />
			)}

			*/}
		</Modal>
	);
};

MultiPaymentDetail.defaultProps = {
	isOpen: false,
};

MultiPaymentDetail.displayName = "MultiPaymentDetail";
