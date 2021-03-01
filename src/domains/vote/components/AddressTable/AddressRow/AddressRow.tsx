import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import { useEnvironmentContext } from "app/contexts";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shouldUseDarkColors } from "utils/electron-utils";

type AddressRowProps = {
	index: number;
	maxVotes: number;
	wallet: ReadWriteWallet;
	onSelect?: (walletAddress: string) => void;
};

export const AddressRow = ({ index, maxVotes, wallet, onSelect }: AddressRowProps) => {
	const { t } = useTranslation();
	const { env } = useEnvironmentContext();

	const [shadowColor, setShadowColor] = useState("--theme-background-color");
	const [votes, setVotes] = useState<ReadOnlyWallet[]>([]);

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

	const getIconColor = (type: string) => (type === "Starred" ? "text-theme-warning-400" : "text-theme-secondary-600");

	useEffect(() => {
		const loadVotes = () => {
			let votes: ReadOnlyWallet[] = [];

			try {
				votes = wallet.votes();
			} catch {
				votes = [];
			}

			setVotes(votes);
		};

		loadVotes();
	}, [env, wallet]);

	const hasVotes = votes.length > 0;
	const [first, second, third, ...rest] = votes;

	const renderAvatar = (address: string, username?: string) => (
		<Tooltip content={username}>
			<span className="inline-block">
				<Avatar size="lg" address={address} shadowColor={shadowColor} />
			</span>
		</Tooltip>
	);

	const WalletIcon = ({ type }: { type: string }) => (
		<Tooltip content={t(`COMMON.${type.toUpperCase()}`)}>
			<div className={`inline-block p-1 ${getIconColor(type)}`}>
				<Icon name={getIconName(type)} width={20} />
			</div>
		</Tooltip>
	);

	return (
		<TableRow
			onMouseEnter={() => setShadowColor(shouldUseDarkColors() ? "--theme-black" : "--theme-color-secondary-100")}
			onMouseLeave={() => setShadowColor("")}
		>
			<TableCell variant="start" innerClassName="space-x-4">
				<Avatar size="lg" address={wallet.address()} noShadow />
				<Address address={wallet.address()} walletName={wallet.alias()} />
			</TableCell>

			<TableCell innerClassName="justify-center text-sm font-bold text-center align-middle">
				<div className="inline-flex items-center space-x-2">
					{[
						wallet.isLedger() && <WalletIcon key="ledger" type="Ledger" />,
						wallet.isStarred() && <WalletIcon key="star" type="Starred" />,
						wallet.hasSyncedWithNetwork() && wallet.isMultiSignature() && (
							<WalletIcon key="multisig" type="MultiSignature" />
						),
					]}
				</div>
			</TableCell>

			<TableCell innerClassName="justify-end font-bold text-theme-secondary-text whitespace-nowrap">
				<Amount value={wallet.balance()} ticker={wallet.network().ticker()} />
			</TableCell>

			<TableCell innerClassName="space-x-4 font-bold">
				{hasVotes ? (
					maxVotes === 1 ? (
						<>
							<Avatar size="lg" address={votes[0].address()} noShadow />
							<span>{votes[0].username()}</span>
						</>
					) : (
						<div className="flex items-center h-11">
							<div className="flex -space-x-3">
								{renderAvatar(first.address(), first.username())}

								{second && renderAvatar(second.address(), second.username())}

								{third && renderAvatar(third.address(), third.username())}

								{rest && rest.length === 1 && renderAvatar(rest[0].address(), rest[0].username())}

								{rest && rest.length > 1 && (
									<Circle
										size="lg"
										className="relative border-theme-text text-theme-text"
										shadowColor={shadowColor}
									>
										<span className="font-semibold">+{rest.length}</span>
									</Circle>
								)}
							</div>
						</div>
					)
				) : (
					<>
						<Circle
							size="lg"
							className="border-theme-secondary-300 dark:border-theme-secondary-800"
							noShadow
						/>
						<span className="text-theme-secondary-400">{t("COMMON.NOT_AVAILABLE")}</span>
					</>
				)}
			</TableCell>

			{maxVotes === 1 ? (
				<>
					<TableCell innerClassName="justify-center font-bold text-theme-secondary-text">
						{hasVotes && <span>#{votes[0].rank()}</span>}
					</TableCell>

					<TableCell innerClassName="justify-center">
						{hasVotes && (
							<Icon
								name="StatusOk"
								className="text-theme-success-600"
								width={22}
								height={22}
								data-testid="AddressRow__status"
							/>
						)}
					</TableCell>
				</>
			) : (
				<TableCell>
					<div className="font-bold text-theme-secondary-400">
						<span className="text-theme-secondary-text">{hasVotes ? votes.length : "0"}</span>
						<span>/{maxVotes}</span>
					</div>
				</TableCell>
			)}

			<TableCell variant="end" innerClassName="justify-end">
				<Button
					variant="secondary"
					onClick={() => onSelect?.(wallet.address())}
					data-testid={`AddressRow__select-${index}`}
				>
					{t("COMMON.VOTE")}
				</Button>
			</TableCell>
		</TableRow>
	);
};
