import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Amount, AmountCrypto } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { TableCell, TableRow } from "app/components/Table";
import { WalletIcons } from "app/components/WalletIcons";
import { useActiveProfile, useWalletAlias } from "app/hooks";
import cn from "classnames";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React, { useMemo } from "react";
import { shouldUseDarkColors } from "utils/electron-utils";

export interface WalletListItemProperties {
	wallet: Contracts.IReadWriteWallet;
	activeWalletId?: string;
	onClick?: (walletId: string) => void;
}

export const WalletListItem: React.FC<WalletListItemProperties> = ({
	wallet,
	activeWalletId,
	onClick,
}: WalletListItemProperties) => {
	const isSelected = useMemo(() => activeWalletId === wallet.id(), [activeWalletId, wallet]);

	const activeProfile = useActiveProfile();

	const shadowClasses = useMemo(
		() =>
			cn(
				"group-hover:ring-theme-secondary-100 group-hover:bg-secondary-100 dark:group-hover:ring-black dark:group-hover:bg-black",
				{
					"ring-theme-success-900": isSelected && shouldUseDarkColors(),
					"ring-theme-success-100": isSelected && !shouldUseDarkColors(),
					"ring-theme-background": !isSelected,
				},
			),
		[isSelected],
	);

	const alias = useWalletAlias({
		address: wallet.address(),
		profile: activeProfile,
		coinId: wallet.coinId(),
		networkId: wallet.networkId(),
	});

	let lastCellContent = undefined;

	if (wallet.network().isTest()) {
		lastCellContent = "N/A";
	} else {
		lastCellContent = (
			<Amount ticker={wallet.exchangeCurrency()} value={wallet.convertedBalance()} />
		);
	}

	return (
		<TableRow isSelected={isSelected} onClick={() => onClick?.(wallet.id())}>
			<TableCell variant="start" innerClassName="space-x-4">
				<div className="flex-shrink-0 -space-x-2">
					<NetworkIcon
						size="lg"
						coin={wallet.coinId()}
						network={wallet.networkId()}
						shadowClassName={shadowClasses}
					/>
					<Avatar size="lg" address={wallet.address()} shadowClassName={shadowClasses} />
				</div>
				<Address walletName={alias} address={wallet.address()} />
			</TableCell>

			<TableCell innerClassName="justify-center text-sm font-bold text-center align-middle">
				<div className="inline-flex items-center space-x-1">
					<WalletIcons wallet={wallet} />
				</div>
			</TableCell>

			<TableCell innerClassName="font-semibold justify-end">
				<AmountCrypto value={wallet.balance()} ticker={wallet.network().ticker()} />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end text-theme-secondary-400">
				{lastCellContent}
			</TableCell>
		</TableRow>
	);
};
