import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { shouldUseDarkColors } from "utils/electron-utils";

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

	const { t } = useTranslation();

	const handleAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	/* istanbul ignore next */
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

	const WalletIcon = ({ type }: { type: string }) => (
		<Tooltip key={type} content={t(`COMMON.${type.toUpperCase()}`)}>
			<div className={`inline-block p-1 ${getIconColor(type)}`}>
				<Icon name={getIconName(type)} width={20} />
			</div>
		</Tooltip>
	);

	return (
		<TableRow
			isSelected={isSelected}
			onClick={() => onClick?.(wallet.id())}
			onMouseEnter={() =>
				setShadowColor(shouldUseDarkColors() ? "--theme-color-neutral-800" : "--theme-color-neutral-100")
			}
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
				<div className="inline-flex items-center space-x-2">
					{[
						wallet.isLedger() && <WalletIcon key="Ledger" type="Ledger" />,
						wallet.isStarred() && <WalletIcon key="Starred" type="Starred" />,
						/* istanbul ignore next */
						wallet.hasSyncedWithNetwork() && wallet.isMultiSignature() && (
							<WalletIcon key="MultiSignature" type="MultiSignature" />
						),
					]}
				</div>
			</TableCell>

			<TableCell innerClassName="font-semibold justify-end">
				<Amount value={wallet.balance()} ticker={wallet.network().ticker()} />
			</TableCell>

			<TableCell variant={hasActions ? "middle" : "end"} innerClassName="justify-end text-theme-neutral-400">
				<Amount value={wallet.convertedBalance()} ticker={wallet.exchangeCurrency() || "BTC"} />
			</TableCell>

			{hasActions && (
				<TableCell variant="end">
					<div className="text-theme-neutral-400 hover:text-theme-neutral-500">
						<Dropdown options={actions} onSelect={handleAction} />
					</div>
				</TableCell>
			)}
		</TableRow>
	);
};
