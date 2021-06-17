import { TransactionCompactRow } from "domains/transaction/components/TransactionTable/TransactionRow/TransactionCompactRow";
import React, { useEffect, useState } from "react";
import VisibilitySensor from "react-visibility-sensor";

import { NotificationTransactionItemProperties, NotificationTransactionItemSkeleton } from ".";

export const NotificationTransactionItem = ({
	notification,
	profile,
	onVisibilityChange,
	containmentRef,
	onTransactionClick,
}: NotificationTransactionItemProperties) => {
	const [transaction, setTransaction] = useState<any>();
	const [walletName, setWalletName] = useState<string>();

	useEffect(() => {
		const fetchTransaction = async () => {
			const wallet = profile.wallets().findByAddress(notification?.meta?.walletAddress);
			const notificationTransaction = await wallet
				?.transactionIndex()
				.findById(notification?.meta?.transactionId);

			const senderWallet = profile.contacts().findByAddress(notificationTransaction?.sender() as string);

			setWalletName(senderWallet[0]?.name());
			setTransaction(notificationTransaction);
		};
		fetchTransaction();
	}, [profile, notification]);

	if (!transaction) {
		return <NotificationTransactionItemSkeleton />;
	}

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
