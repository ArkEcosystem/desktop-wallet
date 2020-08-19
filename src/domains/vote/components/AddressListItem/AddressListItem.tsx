import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

type AddressListItemProps = {
	index: number;
	wallet: Wallet;
	onSelect?: (walletAddress: string) => void;
};

export const AddressListItem = ({ index, wallet, onSelect }: AddressListItemProps) => {
	const { t } = useTranslation();

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
			<td className="py-5">
				<Avatar address={wallet.address()} />
			</td>

			<td className="w-20 py-5">
				<Address walletName={wallet.alias()} address={wallet.address()} maxChars={22} />
			</td>

			<td className="w-20 py-5 text-sm font-bold text-center align-middle">
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

			<td className="py-5 font-bold text-theme-neutral-dark">
				<Amount value={wallet.balance()} ticker={wallet.network().currency.ticker} />
			</td>

			{/* 			<td className="py-5">
				{delegateAddress ? (
					<Avatar address={delegateAddress} />
				) : (
					<Circle className="border-theme-neutral-300" />
				)}
			</td>

			<td className="py-5 font-bold">
				{delegateName ? (
					<span>{delegateName}</span>
				) : (
					<span className="text-theme-neutral-light">{t("COMMON.NOT_AVAILABLE")}</span>
				)}
			</td>

			<td className="py-5 font-bold text-theme-neutral-dark">{rank && <span>#{rank}</span>}</td>

			<td className="py-5">
				{msqUrl && (
					<div className="flex justify-center h-full">
						<a href={msqUrl} target="_blank" rel="noopener noreferrer">
							<Icon name="Msq" className="text-xl text-theme-primary" />
						</a>
					</div>
				)}
			</td>

			<td className="py-5">
				{isActive && (
					<div className="flex justify-center h-full">
						<Icon name="Ok" className="text-theme-success" />
					</div>
				)}
			</td> */}

			<td className="py-5">
				<div className="text-right">
					<Button
						variant="plain"
						onClick={() => onSelect?.(wallet.address())}
						data-testid={`AddressListItem__select-${index}`}
					>
						{t("COMMON.SELECT")}
					</Button>
				</div>
			</td>
		</tr>
	);
};
