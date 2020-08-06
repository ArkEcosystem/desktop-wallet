import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { upperFirst } from "@arkecosystem/utils";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

import { Dropdown } from "../Dropdown";

export type WalletListItemProps = {
	wallet: Wallet;
	exchangeCurrency?: string;
	coinClass?: string;
	actions?: any[];
	variant?: "singleAction";
	onAction?: any;
};

export const WalletListItem = ({
	wallet,
	coinClass,
	actions,
	variant,
	onAction,
	exchangeCurrency,
}: WalletListItemProps) => {
	const { t } = useTranslation();

	const onDropdownAction = (action: any) => {
		if (typeof onAction === "function") onAction(action);
	};

	const coinName = wallet.coin().manifest().get<string>("name");

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
		<tr className="border-b border-theme-neutral-200">
			<td className="py-6 mt-1">
				<div className="flex">
					<Circle className={coinClass} size="lg">
						{coinName && <Icon name={upperFirst(coinName.toLowerCase())} width={20} height={20} />}
					</Circle>
					<Avatar size="lg" address={wallet.address()} />
				</div>
			</td>
			<td className="py-1">
				<Address walletName={wallet.alias()} address={wallet.address()} maxChars={22} />
			</td>
			<td className="py-1 text-sm align-middle font-bold text-center">
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
				<Amount value={wallet.balance()} ticker={wallet.network().currency.ticker} />
			</td>
			<td className="text-right text-theme-neutral-light">
				<Amount value={wallet.convertedBalance()} ticker={exchangeCurrency!} />
			</td>
			{actions && (
				<td>
						{actions.length > 0 &&
						(() => {
							if (variant === "singleAction") {
								return (
									<div className="text-right">
										<Button data-testid="button" variant="plain" onClick={onDropdownAction}>
											{actions[0].label}
										</Button>
									</div>
								);
							}

							return (
								<div className="text-theme-neutral-light hover:text-theme-neutral">
									<Dropdown options={actions} onSelect={onDropdownAction} />
								</div>
							);
						})()}
				</td>
			)}
		</tr>
	);
};

WalletListItem.defaultProps = {
	address: "",
	exchangeCurrency: "",
};
