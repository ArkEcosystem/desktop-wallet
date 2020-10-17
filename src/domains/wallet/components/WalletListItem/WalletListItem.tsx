import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { AvatarWrapper } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type Option = {
	label: string;
	value: string | number;
};

type Props = {
	wallet: ReadWriteWallet;
	isCondensed: boolean;
	onAction?: (action: Option, address: string) => void;
	options: Option[];
};

export const WalletListItem = ({ wallet, isCondensed, onAction, options }: Props) => {
	const { t } = useTranslation();

	// TODO: add "Business", "Bridgechain"
	const walletTypes: string[] = ["Delegate"];

	return (
		<TableRow key={wallet.id()} border>
			<TableCell variant="start" className="w-1">
				<div className="mr-4">
					<AvatarWrapper data-testid="WalletListItem__user--avatar" size="lg" noShadow>
						<img
							src={`data:image/svg+xml;utf8,${wallet.avatar()}`}
							title={wallet.alias()}
							alt={wallet.alias()}
						/>
						{wallet && wallet.alias && (
							<span className="absolute text-sm font-semibold text-theme-background">
								{wallet?.alias()?.slice(0, 2)?.toUpperCase()}
							</span>
						)}
					</AvatarWrapper>
				</div>
			</TableCell>

			<TableCell className="">
				<Address address={wallet.address()} maxChars={24} />
			</TableCell>

			<TableCell>
				<span data-testid="WalletListItem__name">{wallet.alias()}</span>
			</TableCell>

			<TableCell>
				<span data-testid="WalletListItem__type">{t("COMMON.MY_WALLET")}</span>
			</TableCell>

			{!isCondensed && (
				<TableCell className={""} innerClassName="space-x-2 text-sm font-bold justify-center">
					{wallet.hasSyncedWithNetwork() &&
						walletTypes.map(
							(type: string) =>
								// @ts-ignore
								wallet[`is${type}`]() && (
									<Tippy key={type} content={t(`COMMON.${type.toUpperCase()}`)}>
										<Circle className="border-black" noShadow>
											<Icon name={type} width={25} height={25} />
										</Circle>
									</Tippy>
								),
						)}
				</TableCell>
			)}

			<TableCell
				variant="end"
				className="border-b border-dashed border-theme-neutral-300 dark:border-theme-neutral-800"
				innerClassName="justify-end"
			>
				<Button
					data-testid={`WalletListItem__one-option-button-${wallet.id()}`}
					className="float-right"
					variant="plain"
					onClick={() => onAction?.(options[0], wallet.address())}
				>
					{options[0]?.label}
				</Button>
			</TableCell>
		</TableRow>
	);
};

WalletListItem.defaultProps = {
	isCondensed: false,
};
