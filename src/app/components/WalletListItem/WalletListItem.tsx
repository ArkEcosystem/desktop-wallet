import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import { useDarkMode } from "app/hooks";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Dropdown } from "../Dropdown";

export type WalletListItemProps = {
	wallet: ReadWriteWallet;
	activeWalletId?: string;
	actions?: string | any[];
	variant?: "condensed";
	onAction?: any;
	onClick?: (walletId: string) => void;
};

export const WalletListItem = ({
	wallet,
	activeWalletId,
	actions,
	variant,
	onAction,
	onClick,
}: WalletListItemProps) => {
	const isSelected = useMemo(() => activeWalletId === wallet.id(), [activeWalletId, wallet]);
	const hasActions = useMemo(() => actions && actions.length > 0, [actions]);

	const isDark = useDarkMode();

	const defaultShadowColor = useMemo(
		() =>
			isSelected
				? isDark
					? "--theme-color-success-900"
					: "--theme-color-success-100"
				: "--theme-background-color",
		[isDark, isSelected],
	);

	const [shadowColor, setShadowColor] = React.useState<string>(defaultShadowColor);

	const { t } = useTranslation();

	const handleAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	const walletTypes = ["Ledger", "MultiSignature", "Starred"];

	const getIconName = (type: string) => {
		switch (type) {
			case "Starred":
				return "Star";
			case "MultiSignature":
				return "Multisig";
			default:
				return type;
		}
	};

	const getIconColor = (type: string) => (type === "Starred" ? "text-theme-warning-400" : "text-theme-neutral-600");

	return (
		<TableRow
			onClick={() => onClick?.(wallet.id())}
			onMouseEnter={() => setShadowColor(isDark ? "--theme-color-neutral-800" : "--theme-color-neutral-100")}
			onMouseLeave={() => setShadowColor(defaultShadowColor)}
		>
			<TableCell variant="start" isSelected={isSelected} innerClassName="space-x-4">
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

			<TableCell
				isSelected={isSelected}
				innerClassName="justify-center text-sm font-bold text-center align-middle"
			>
				<div className="inline-flex items-center space-x-2">
					{wallet.hasSyncedWithNetwork() &&
						walletTypes.map((type: string) =>
							// @ts-ignore
							wallet[`is${type}`]() ? (
								<Tooltip key={type} content={t(`COMMON.${type.toUpperCase()}`)}>
									<span className={getIconColor(type)}>
										<Icon name={getIconName(type)} width={18} />
									</span>
								</Tooltip>
							) : null,
						)}
				</div>
			</TableCell>

			<TableCell isSelected={isSelected} innerClassName="font-semibold justify-end">
				<Amount value={wallet.balance()} ticker={wallet.network().ticker()} />
			</TableCell>

			<TableCell
				variant={hasActions ? "middle" : "end"}
				isSelected={isSelected}
				innerClassName="justify-end text-theme-neutral-light"
			>
				<Amount value={wallet.convertedBalance()} ticker={wallet.exchangeCurrency() || "BTC"} />
			</TableCell>

			{hasActions && (
				<TableCell variant="end" isSelected={isSelected}>
					<div className="text-theme-neutral-light hover:text-theme-neutral">
						<Dropdown options={actions} onSelect={handleAction} />
					</div>
				</TableCell>
			)}
		</TableRow>
	);
};
