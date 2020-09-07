import React from "react";
import { useTranslation } from "react-i18next";

export const MyVoteTable = () => {
	const { t } = useTranslation();

	return (
		<div data-testid="MyVoteTable">
			<h2 className="pt-5 mb-0 text-2xl font-bold">{t("VOTE.MY_VOTE_TABLE.TITLE")}</h2>
			<div className="text-theme-neutral-dark">{t("VOTE.MY_VOTE_TABLE.NO_VOTE")}</div>
		</div>
	);
};
