import React from "react";
import { Section } from "app/components/Layout";
import { EmptyResults } from "app/components/EmptyResults";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useTranslation } from "react-i18next";
import { AddressTable } from "domains/vote/components/AddressTable";

type VotingWalletsProps = {
	showEmptyResults: boolean;
	walletsByCoin: Record<string, Contracts.IReadWriteWallet[]>;
	onSelectAddress: (address: string) => void;
};

export const VotingWallets = ({ showEmptyResults, walletsByCoin, onSelectAddress }: VotingWalletsProps) => {
	const { t } = useTranslation();

	if (showEmptyResults) {
		return (
			<Section>
				<EmptyResults
					className="mt-16"
					title={t("COMMON.EMPTY_RESULTS.TITLE")}
					subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
				/>
			</Section>
		);
	}

	return (
		<>
			{Object.keys(walletsByCoin).map(
				(coin, index) =>
					walletsByCoin[coin].length > 0 && (
						<Section key={index}>
							<AddressTable wallets={walletsByCoin[coin]} onSelect={onSelectAddress} />
						</Section>
					),
			)}
		</>
	);
};
