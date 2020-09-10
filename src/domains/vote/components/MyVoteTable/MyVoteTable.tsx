import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

type MyVoteTableProps = {
	address: string;
	votes: ReadOnlyWallet[];
};

export const MyVoteTable = ({ address, votes }: MyVoteTableProps) => {
	const { t } = useTranslation();
	const history = useHistory();
	const { walletId: hasWalletId } = useParams();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const hasVotes = votes && votes.length > 0;

	return (
		<div data-testid="MyVoteTable">
			{hasVotes ? (
				<DelegateTable
					title={t("VOTE.MY_VOTE_TABLE.TITLE")}
					delegates={votes}
					votes={votes}
					onContinue={(unvotes) => {
						const walletId = hasWalletId
							? activeWallet.id()
							: activeProfile.wallets().findByAddress(address)?.id();

						const params = new URLSearchParams({
							unvotes: unvotes.join(),
						});

						history.push({
							pathname: `/profiles/${activeProfile.id()}/wallets/${walletId}/send-vote`,
							search: `?${params}`,
						});
					}}
				/>
			) : (
				<>
					<h2 className="pt-5 text-2xl font-bold">{t("VOTE.MY_VOTE_TABLE.TITLE")}</h2>
					<div className="text-theme-neutral-dark">{t("VOTE.MY_VOTE_TABLE.NO_VOTE")}</div>
				</>
			)}
		</div>
	);
};

MyVoteTable.defaultProps = {
	votes: [],
};
