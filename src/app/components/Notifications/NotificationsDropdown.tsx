import { ExtendedTransactionData, Profile } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Notifications } from "app/components/Notifications";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import React, { useEffect, useState } from "react";

export const NotificationsDropdown = ({ profile }: { profile: Profile }) => {
	const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([]);
	const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
	const [transactionModalItem, setTransactionModalItem] = useState<ExtendedTransactionData>();

	const hasUnread = profile.notifications().unread().length > 0;

	const fetchTransactions = async () => {
		setIsLoadingTransactions(true);
		const txs = await profile.transactionAggregate().transactions({ limit: 5 });
		setTransactions([...transactions, ...txs.items()]);
		setIsLoadingTransactions(false);
	};

	useEffect(() => {
		fetchTransactions();
	}, [profile]);

	return (
		<div>
			<Dropdown
				toggleContent={
					<div className="overflow-hidden rounded-lg">
						<Button
							variant="transparent"
							size="icon"
							className="text-theme-primary-300 hover:text-theme-primary-700 hover:bg-theme-primary-50"
							data-testid="navbar__buttons--notifications"
						>
							<Icon name="Notification" width={22} height={22} className="p-1" />
							{hasUnread && (
								<div className="absolute right-0 flex items-center justify-center w-3 h-3 mr-3 -mt-3 bg-white border-white rounded-full">
									<div className="w-2 h-2 rounded-full bg-theme-danger-500" />
								</div>
							)}
						</Button>
					</div>
				}
			>
				<div className="mt-2">
					<Notifications
						profile={profile}
						transactions={transactions}
						onTransactionClick={setTransactionModalItem}
						onFetchMoreTransactions={fetchTransactions}
						isLoadingTransactions={isLoadingTransactions}
					/>
				</div>
			</Dropdown>

			{transactionModalItem && (
				<TransactionDetailModal
					isOpen={!!transactionModalItem}
					transactionItem={transactionModalItem}
					onClose={() => setTransactionModalItem(undefined)}
				/>
			)}
		</div>
	);
};
