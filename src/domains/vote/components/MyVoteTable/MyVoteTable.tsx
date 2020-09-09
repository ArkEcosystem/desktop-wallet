import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import React from "react";
import { useTranslation } from "react-i18next";

type MyVoteTableProps = {
	votes: ReadOnlyWallet[];
};

export const MyVoteTable = ({ votes }: MyVoteTableProps) => {
	const { t } = useTranslation();

	const hasVotes = votes && votes.length > 0;

	return (
		<div data-testid="MyVoteTable">
			{hasVotes ? (
				<DelegateTable title={t("VOTE.MY_VOTE_TABLE.TITLE")} delegates={votes} votes={votes} />
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
