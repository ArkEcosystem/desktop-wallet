import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { EmptyBlock } from "app/components/EmptyBlock";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import React from "react";
import { useTranslation } from "react-i18next";

type MyVoteTableProps = {
	maxVotes: number;
	votes?: ReadOnlyWallet[];
	selectedAddress: string;
	onContinue?: (unvotes: string[], votes: string[]) => void;
};

export const MyVoteTable = ({ maxVotes, votes, selectedAddress, onContinue }: MyVoteTableProps) => {
	const { t } = useTranslation();

	const hasVotes = votes && votes.length > 0;

	return (
		<div data-testid="MyVoteTable">
			{hasVotes ? (
				<DelegateTable
					title={t("VOTE.MY_VOTE_TABLE.TITLE")}
					delegates={votes}
					maxVotes={maxVotes}
					votes={votes}
					selectedAddress={selectedAddress}
					onContinue={onContinue}
				/>
			) : (
				<>
					<h2 className="pt-5 text-2xl font-bold">{t("VOTE.MY_VOTE_TABLE.TITLE")}</h2>
					<EmptyBlock className="mt-3" message={t("VOTE.MY_VOTE_TABLE.NO_VOTE")} />
				</>
			)}
		</div>
	);
};

MyVoteTable.defaultProps = {
	votes: [],
};
