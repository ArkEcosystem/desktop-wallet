import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { hasProperty } from "@arkecosystem/utils";
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
		const loadVotes = () => {
			if (!hasProperty(wallet, "isLoading")) {
				let votes: ReadOnlyWallet[] = [];

				try {
					votes = wallet.votes();
				} catch {
					votes = [];
				}

				setVotes(votes);
			}
		};

		loadVotes();
	}, [env, wallet]);

	const hasVotes = votes.length > 0;

	if (isLoading) {
		return <AddressRowSkeleton />;
	}

	return (
		<TableRow>
			<TableCell variant="start" className="w-20" innerClassName="space-x-4">
				<Avatar size="lg" address={wallet.address()} noShadow />
				<Address address={wallet.address()} walletName={wallet.alias()} />
			</TableCell>

			<TableCell className="w-20" innerClassName="justify-center text-sm font-bold text-center align-middle">
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

			<TableCell innerClassName="justify-end font-bold text-theme-secondary-text">
				<Amount value={wallet.balance()} ticker={wallet.network().ticker()} />
			</TableCell>

			<TableCell innerClassName="space-x-4 font-bold">
				{hasVotes ? (
					<>
						<Avatar size="lg" address={votes[0].address()} noShadow />
						<span>{votes[0].username()}</span>
					</>
				) : (
					<>
						<Circle size="lg" className="border-theme-neutral-300 dark:border-theme-neutral-800" noShadow />
						<span className="text-theme-neutral-light">{t("COMMON.NOT_AVAILABLE")}</span>
					</>
				)}
			</TableCell>

			<TableCell innerClassName="justify-center font-bold text-theme-secondary-text">
				{hasVotes && <span>#{votes[0].rank()}</span>}
			</TableCell>

			<TableCell innerClassName="justify-center">
				{hasVotes && (
					<Icon name="Msq" className="text-xl text-theme-primary" data-testid="AddressRow__profile" />
				)}
			</TableCell>

			<TableCell innerClassName="justify-center">
				{hasVotes && (
					<Icon
						name="StatusOk"
						className="text-theme-success"
						width={22}
						height={22}
						data-testid="AddressRow__status"
					/>
				)}
			</TableCell>

			<TableCell variant="end" innerClassName="justify-end">
				<Button
					variant="plain"
					onClick={() => onSelect?.(wallet.address())}
					data-testid={`AddressRow__select-${index}`}
				>
					{t("COMMON.SELECT")}
				</Button>
			</TableCell>
		</TableRow>
	);
};

AddressRow.defaultProps = {
	isLoading: false,
};
