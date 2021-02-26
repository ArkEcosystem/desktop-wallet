import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { TableCell, TableRow } from "app/components/Table";
import { WalletIcons } from "app/components/WalletIcons";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React, { useMemo } from "react";
import { shouldUseDarkColors } from "utils/electron-utils";

export type WalletListItemProps = {
	wallet: ReadWriteWallet;
	activeWalletId?: string;
	variant?: "condensed";
	onClick?: (walletId: string) => void;
};

export const WalletListItem = ({ wallet, activeWalletId, variant, onClick }: WalletListItemProps) => {
	const isSelected = useMemo(() => activeWalletId === wallet.id(), [activeWalletId, wallet]);

	const defaultShadowColor = useMemo(
		() =>
			isSelected
				? shouldUseDarkColors()
					? "--theme-color-success-900"
					: "--theme-color-success-100"
				: "--theme-background-color",
		[isSelected],
	);

	const [shadowColor, setShadowColor] = React.useState<string>(defaultShadowColor);

	return (
		<TableRow
			isSelected={isSelected}
			onClick={() => onClick?.(wallet.id())}
			onMouseEnter={() => setShadowColor(shouldUseDarkColors() ? "--theme-black" : "--theme-color-secondary-100")}
			onMouseLeave={() => setShadowColor(defaultShadowColor)}
		>
			<TableCell variant="start" innerClassName="space-x-4">
				<div className="-space-x-2">
					<NetworkIcon
						size="lg"
						coin={wallet.coinId()}
						network={wallet.networkId()}
						shadowColor={shadowColor}
					/>
					<Avatar size="lg" address={wallet.address()} shadowColor={shadowColor} />
				</div>
				<Address walletName={wallet.alias()} address={wallet.address()} maxChars={22} />
			</TableCell>

			<TableCell innerClassName="justify-center text-sm font-bold text-center align-middle">
				<div className="inline-flex items-center space-x-1">
					<WalletIcons wallet={wallet} />
				</div>
			</TableCell>

			<TableCell innerClassName="font-semibold justify-end">
				<Amount value={wallet.balance()} ticker={wallet.network().ticker()} />
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end text-theme-secondary-400">
				<Amount
					value={wallet.convertedBalance()}
					ticker={wallet.exchangeCurrency() || "BTC"}
					normalize={false}
				/>
			</TableCell>
		</TableRow>
	);
};
