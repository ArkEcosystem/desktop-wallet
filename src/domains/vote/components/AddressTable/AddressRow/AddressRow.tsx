import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type AddressRowProps = {
	index: number;
	wallet: Wallet;
	onSelect?: (walletAddress: string) => void;
};

export const AddressRow = ({ index, wallet, onSelect }: AddressRowProps) => {
	const [votes, setVotes] = useState<Coins.WalletDataCollection>((null as unknown) as Coins.WalletDataCollection);

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

	useEffect(() => {
		const loadVotes = async () => {
			let response;

			try {
				response = await wallet.votes();
			} catch (error) {
				return;
			}

			const transaction = response.items()[0];
			const result: Contracts.WalletData[] = [];

			const votes = (transaction?.asset().votes as string[]) || [];
			for (const vote of votes) {
				const mode = vote[0];
				const publicKey = vote.substr(1);
				/* istanbul ignore next */
				if (mode === "-") {
					continue;
				}

				const voteData = await wallet.client().wallet(publicKey);

				result.push(voteData);
			}

			const votesResult = new Coins.WalletDataCollection(result, {
				prev: undefined,
				self: undefined,
				next: undefined,
			});

			setVotes(votesResult);
		};

		loadVotes();
	}, [wallet]);

	const hasVotes = votes?.items().length > 0;

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
				<Amount value={wallet.balance()} ticker={wallet.network().currency.ticker} />
			</td>

			<td className="py-5">
				{hasVotes ? (
					<Avatar address={votes?.items()[0].address()} />
				) : (
					<Circle className="border-theme-neutral-300" />
				)}
			</td>

			<td className="py-5 font-bold">
				{hasVotes ? (
					<span>{votes?.items()[0].username()}</span>
				) : (
					<span className="text-theme-neutral-light">{t("COMMON.NOT_AVAILABLE")}</span>
				)}
			</td>

			<td className="py-5 font-bold text-theme-neutral-dark">
				{hasVotes && <span>#{votes?.items()[0].rank()}</span>}
			</td>

			<td className="py-5">
				{hasVotes && (
					<div className="flex justify-center h-full">
						<Icon name="Msq" className="text-xl text-theme-primary" />
					</div>
				)}
			</td>

			<td className="py-5">
				{hasVotes && (
					<div className="flex justify-center h-full">
						<Icon
							name={votes?.items()[0].hasPassed() ? "Ok" : "StatusClock"}
							className={votes?.items()[0].hasPassed() ? "text-theme-success" : "text-theme-neutral"}
						/>
					</div>
				)}
			</td>

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
