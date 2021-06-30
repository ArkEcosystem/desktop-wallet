import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { TransactionCompactRow } from "domains/transaction/components/TransactionTable/TransactionRow/TransactionCompactRow";
import { TransactionCompactRowSkeleton } from "domains/transaction/components/TransactionTable/TransactionRow/TransactionCompactRowSkeleton";
import React, { useEffect, useState } from "react";
import VisibilitySensor from "react-visibility-sensor";

import { NotificationTransactionItemProperties } from "./models";

export const NotificationTransactionItem = ({
	transactionId,
	allTransactions,
	profile,
	onVisibilityChange,
	containmentRef,
	onTransactionClick,
}: NotificationTransactionItemProperties) => {
	const [transaction, setTransaction] = useState<DTO.ExtendedConfirmedTransactionData>();
	const [walletName, setWalletName] = useState<string>();

	useEffect(() => {
		const fetchTransaction = () => {
			const notificationTransaction = allTransactions.find((transaction) => transaction.id() === transactionId);

			const senderWallet = profile.contacts().findByAddress(notificationTransaction?.sender() as string);

			setWalletName(senderWallet[0]?.name());
			setTransaction(notificationTransaction);
		};

		fetchTransaction();
	}, [allTransactions, profile, transactionId]);

	if (!transaction) {
		return <TransactionCompactRowSkeleton borderDotted />;
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
				onClick={() => onTransactionClick?.(transaction)}
			/>
		</VisibilitySensor>
	);
};
