import { ExtendedTransactionData, Profile } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Notifications } from "app/components/Notifications";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { WalletUpdate } from "domains/wallet/components/WalletUpdate";
import React, { useState } from "react";

export const NotificationsDropdown = ({ profile }: { profile: Profile }) => {
	const [transactionModalItem, setTransactionModalItem] = useState<ExtendedTransactionData>();
	const [isWalletUpdateOpen, setIsWalletUpdateOpen] = useState<boolean>();
	const [walletUpdateVersion, setWalletUpdateVersion] = useState<string>();

	const hasUnread = profile.notifications().unread().length > 0;

	const handleNotificationAction = (id: string) => {
		const notification = profile.notifications().get(id);
		const action = `${notification.type}.${notification.action}`;

		switch (action) {
			case "wallet.update":
				setWalletUpdateVersion(notification?.meta?.version);
				setIsWalletUpdateOpen(true);
				break;
		}
	};

	return (
		<div>
			<Dropdown
				toggleContent={
					<div className="overflow-hidden rounded-lg">
						<Button
							variant="transparent"
							size="icon"
							className="text-theme-primary-300 dark:text-theme-neutral-600 hover:text-theme-primary-700 hover:bg-theme-primary-50"
							data-testid="navbar__buttons--notifications"
						>
							<Icon name="Notification" width={22} height={22} className="p-1" />
							{hasUnread && (
								<div className="absolute right-0 flex items-center justify-center w-3 h-3 mr-3 -mt-3 rounded-full bg-theme-background border-theme-background">
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
						onTransactionClick={setTransactionModalItem}
						onNotificationAction={handleNotificationAction}
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

			<WalletUpdate
				version={walletUpdateVersion}
				isOpen={isWalletUpdateOpen}
				onClose={() => setIsWalletUpdateOpen(false)}
				onCancel={() => setIsWalletUpdateOpen(false)}
			/>
		</div>
	);
};
