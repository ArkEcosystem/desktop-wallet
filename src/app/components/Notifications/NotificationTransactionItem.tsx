import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { TransactionCompactRow } from "domains/transaction/components/TransactionTable/TransactionRow/TransactionCompactRow";
import React, { useEffect, useState } from "react";
import VisibilitySensor from "react-visibility-sensor";

import { NotificationTransactionItemProps, NotificationTransactionItemSkeleton } from "./";

export const NotificationTransactionItem = ({
	notification,
	profile,
	onVisibilityChange,
	containmentRef,
	onTransactionClick,
}: NotificationTransactionItemProps) => {
	const [transaction, setTransaction] = useState<ExtendedTransactionData>();
	const [walletName, setWalletName] = useState<string>();

	useEffect(() => {
		const fetchTransaction = async () => {
			// TODO: Fetch transactions by their ids
			const receivedTxs = await profile.transactionAggregate().receivedTransactions({ cursor: 1, limit: 15 });
			/* @ts-ignore */
			const tx = receivedTxs.findById(notification.meta?.txId);

			const senderWallet = profile.contacts().findByAddress(tx?.sender() as string);

			setWalletName(senderWallet[0]?.name());
			setTransaction(tx);
		};
		fetchTransaction();
	}, [profile, notification]);

	if (!transaction) return <NotificationTransactionItemSkeleton />;

	return (
		<VisibilitySensor
			onChange={(isVisible) => onVisibilityChange?.(isVisible)}
			scrollCheck
			delayedCall
			containment={containmentRef?.current}
		>
			<TransactionCompactRow
				walletName={walletName}
				transaction={transaction}
				iconSize="sm"
				onClick={() => onTransactionClick?.(transaction)}
			/>
		</VisibilitySensor>
	);
};
