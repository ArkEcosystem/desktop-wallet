import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Dropdown } from "../Dropdown";

export type WalletListItemProps = {
	wallet: ReadWriteWallet;
	activeWalletId?: string;
	coinClass?: string;
	actions?: string | any[];
	variant?: "condensed";
	onAction?: any;
	onRowClick?: (walletId: string) => void;
};

export const WalletListItem = ({
	wallet,
	activeWalletId,
	coinClass,
	actions,
	variant,
	onAction,
	onRowClick,
}: WalletListItemProps) => {
	const defaultShadowColor = useMemo(
		() => (activeWalletId === wallet.id() ? "--theme-color-success-100" : "--theme-background-color"),
		[activeWalletId, wallet],
	);

	const [shadowColor, setShadowColor] = useState<string>(defaultShadowColor);

	const { t } = useTranslation();

	const handleAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	const coinName = wallet.coinId();

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

	const isSelected = useMemo(() => activeWalletId === wallet.id(), [activeWalletId, wallet]);

	const getIconColor = (type: string) => (type === "Starred" ? "text-theme-warning-400" : "text-theme-neutral-600");

	return (
		<tr
			data-testid={`WalletListItem__${wallet.address()}`}
			className={`transition-colors duration-100 group border-b border-dashed border-theme-neutral-200 ${
				isSelected ? "bg-theme-success-100" : "cursor-pointer hover:bg-theme-neutral-100"
			}`}
			onClick={() => onRowClick?.(wallet.id())}
			onMouseEnter={() => setShadowColor("--theme-color-neutral-100")}
			onMouseLeave={() => setShadowColor(defaultShadowColor)}
		>
			<td className="h-px p-0">
				<div
					className={`rounded-l-lg h-full -ml-8 transition-colors duration-100 ${
						isSelected ? "bg-theme-success-100" : "cursor-pointer group-hover:bg-theme-neutral-100"
					}`}
				/>
			</td>

			<td className="py-6 mt-1">
				<div className="flex">
					<Circle className={`-mr-2 ${coinClass}`} size="lg" shadowColor={shadowColor}>
						{coinName && <Icon name={upperFirst(coinName.toLowerCase())} width={20} height={20} />}
					</Circle>
					<Avatar size="lg" address={wallet.address()} shadowColor={shadowColor} />
				</div>
			</td>

			<td className="py-1">
				<Address walletName={wallet.alias()} address={wallet.address()} maxChars={22} />
			</td>

			<td className="py-1 text-sm font-bold text-center align-middle">
				<div className="inline-flex items-center space-x-2">
					{wallet.hasSyncedWithNetwork() &&
						walletTypes.map((type: string) =>
							// @ts-ignore
							wallet[`is${type}`]() ? (
								<Tippy key={type} content={t(`COMMON.${type.toUpperCase()}`)}>
									<span className={getIconColor(type)}>
										<Icon name={getIconName(type)} width={16} height={16} />
									</span>
								</Tippy>
							) : null,
						)}
				</div>
			</td>

			<td className="font-semibold text-right">
				<Amount value={wallet.balance()} ticker={wallet.network().ticker()} />
			</td>

			<td className="text-right text-theme-neutral-light">
				<Amount value={wallet.convertedBalance()} ticker={wallet.exchangeCurrency() || "BTC"} />
			</td>

			{actions && (
				<td>
					{actions.length > 0 && (
						<div className="text-theme-neutral-light hover:text-theme-neutral">
							<Dropdown options={actions} onSelect={handleAction} />
						</div>
					)}
				</td>
			)}

			<td className="h-px p-0">
				<div
					className={`rounded-r-lg h-full -mr-8 transition-colors duration-100 ${
						isSelected ? "bg-theme-success-100" : "cursor-pointer group-hover:bg-theme-neutral-100"
					}`}
				/>
			</td>
		</tr>
	);
};
