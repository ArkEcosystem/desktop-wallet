import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { TransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { Address } from "app/components/Address";
import { TableCell, TableRow } from "app/components/Table";
import { BaseTransactionRowAmount } from "domains/transaction/components/TransactionTable/TransactionRow/TransactionRowAmount";
import { TransactionRowMode } from "domains/transaction/components/TransactionTable/TransactionRow/TransactionRowMode";
import React, { useEffect,useState } from "react";
import VisibilitySensor from "react-visibility-sensor";

import { NotificationTransactionItemProps,NotificationTransactionItemSkeleton } from "./";

export const NotificationTransactionItem = ({
	notification,
	profile,
	onVisibilityChange,
	containmentRef,
	onTransactionClick,
}: NotificationTransactionItemProps) => {
	const [transaction, setTransaction] = useState<TransactionData>();
	const [wallet, setWallet] = useState<ReadWriteWallet>();

	useEffect(() => {
		const fetchTransaction = async () => {
			try {
				/* @ts-ignore */
				const wallet = profile.wallets().findByAddress(notification.meta?.address);
				if (!wallet) return;

				/* @ts-ignore */
				const tx = await wallet?.client().transaction(notification?.meta?.txId);

				setWallet(wallet);
				setTransaction(tx);
			} catch (e) {
				// TODO: handle
				console.error(e);
			}
		};
		fetchTransaction();
	}, [profile, notification]);

	if (!transaction) return <NotificationTransactionItemSkeleton />;

	return (
		<TableRow onClick={() => onTransactionClick?.(transaction as ExtendedTransactionData)}>
			<TableCell variant="start" className="w-24">
				<TransactionRowMode transaction={transaction} iconSize="sm" />
			</TableCell>

			<TableCell>
				<Address walletName={wallet?.alias()} address={transaction.recipient()} maxChars={10} />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				<VisibilitySensor
					onChange={(isVisible) => onVisibilityChange?.(isVisible)}
					scrollCheck
					delayedCall
					containment={containmentRef?.current}
				>
					<BaseTransactionRowAmount
						isSent={transaction.isSent()}
						wallet={wallet}
						total={transaction.amount()}
					/>
				</VisibilitySensor>
			</TableCell>
		</TableRow>
	);
};
