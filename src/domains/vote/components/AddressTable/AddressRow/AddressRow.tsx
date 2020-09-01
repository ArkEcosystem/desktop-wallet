import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { hasProperty } from "@arkecosystem/utils";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { useEnvironmentContext } from "app/contexts";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AddressRowSkeleton } from "./AddressRowSkeleton";

type AddressRowProps = {
	index: number;
	wallet: ReadWriteWallet;
	isLoading?: boolean;
	onSelect?: (walletAddress: string) => void;
};

export const AddressRow = ({ index, wallet, isLoading, onSelect }: AddressRowProps) => {
	const [votes, setVotes] = useState<ReadOnlyWallet[]>([]);

	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

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

	useEffect(() => {
		const loadVotes = async () => {
			if (!hasProperty(wallet, "isLoading")) {
				// TODO: move this to profile initialising and run it every X period
				await env.delegates().sync(wallet?.coinId(), wallet?.networkId());

				let votes: ReadOnlyWallet[] = [];
				try {
					await wallet.syncVotes();

					votes = wallet.votes();
				} catch {
					votes = [];
				}

				setVotes(votes);
			}
		};

		loadVotes();
	}, [env, wallet]);

	const hasVotes = votes && votes?.length > 0;

	if (isLoading) {
		return <AddressRowSkeleton />;
	}

	return (
		<tr className="border-b border-dotted border-theme-neutral-300">
			<td className="py-5">
				<Avatar address={wallet.address()} />
			</td>

			<td className="w-20 py-5">
				<Address address={wallet.address()} walletName={wallet.alias()} maxChars={22} />
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
				<Amount value={wallet.balance()} ticker={wallet.network().ticker()} />
			</td>

			<td className="py-5">
				{hasVotes ? <Avatar address={votes[0].address()} /> : <Circle className="border-theme-neutral-300" />}
			</td>

			<td className="py-5 font-bold">
				{hasVotes ? (
					<span>{votes[0].username()}</span>
				) : (
					<span className="text-theme-neutral-light">{t("COMMON.NOT_AVAILABLE")}</span>
				)}
			</td>

			<td className="py-5 font-bold text-theme-neutral-dark">{hasVotes && <span>#{votes[0].rank()}</span>}</td>

			<td className="py-5">
				{hasVotes && (
					<div className="flex justify-center h-full" data-testid="AddressRow__profile">
						<Icon name="Msq" className="text-xl text-theme-primary" />
					</div>
				)}
			</td>

			<td className="py-5">
				{hasVotes && (
					<div className="flex justify-center h-full" data-testid="AddressRow__status">
						<Icon name="Ok" className="text-theme-success" />
					</div>
				)}
			</td>

			<td className="py-5">
				<div className="text-right">
					<Button
						variant="plain"
						onClick={() => onSelect?.(wallet.address())}
						data-testid={`AddressRow__select-${index}`}
					>
						{t("COMMON.SELECT")}
					</Button>
				</div>
			</td>
		</tr>
	);
};

AddressRow.defaultProps = {
	isLoading: false,
};
