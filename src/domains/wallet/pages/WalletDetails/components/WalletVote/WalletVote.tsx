import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import React from "react";
import { useTranslation } from "react-i18next";

import { WalletVoteSkeleton } from "./WalletVoteSkeleton";

type WalletVoteProps = {
	wallet: ReadWriteWallet;
	onButtonClick: (address?: string) => void;
	isLoading?: boolean;
};

export const WalletVote = ({ wallet, onButtonClick, isLoading }: WalletVoteProps) => {
	const { t } = useTranslation();

	if (isLoading) {
		return <WalletVoteSkeleton />;
	}

	const maxVotes = wallet.network().maximumVotesPerWallet();
	const votesHelpLink = "https://ark.dev/docs/desktop-wallet/user-guides/how-to-vote-unvote";

	let votes: ReadOnlyWallet[];

	try {
		votes = wallet.votes();
	} catch {
		votes = [];
	}

	// @TODO
	const activeCount = 1;

	const renderVotes = () => {
		const delegate = votes[0];

		return (
			<>
				<Circle
					size="lg"
					className="border-theme-secondary-900 dark:border-theme-secondary-700 text-theme-secondary-900 dark:text-theme-secondary-700"
				>
					<Icon name="Vote" width={17} height={17} />
				</Circle>

				<div className="flex flex-1 ml-4">
					<div className="flex flex-col justify-between font-semibold">
						<span className="text-theme-secondary-500 dark:text-theme-secondary-700 text-sm">
							{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.VOTING_FOR")}
						</span>
						{votes.length === 1 ? (
							<span>{delegate.username()}</span>
						) : (
							<span className="cursor-pointer" onClick={() => onButtonClick()}>
								{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE")}
							</span>
						)}
					</div>

					{votes.length === 1 && (
						<div className="flex flex-col justify-between font-semibold border-l border-theme-secondary-300 dark:border-theme-secondary-800 ml-6 pl-6">
							<span className="text-theme-secondary-500 dark:text-theme-secondary-700 text-sm">
								{t("COMMON.RANK")}
							</span>
							<span>{delegate.rank() ? `#${delegate.rank()}` : t("COMMON.NOT_AVAILABLE")}</span>
						</div>
					)}

					<div className="flex flex-col justify-between font-semibold border-l border-theme-secondary-300 dark:border-theme-secondary-800 ml-6 pl-6">
						<span className="text-theme-secondary-500 dark:text-theme-secondary-700 text-sm">
							{t("COMMON.VOTES")}
						</span>
						<span>
							{votes.length}
							<span className="text-theme-secondary-500 dark:text-theme-secondary-700">/{maxVotes}</span>
						</span>
					</div>
				</div>

				<div className="flex font-semibold border-r border-theme-secondary-300 dark:border-theme-secondary-800 mr-6 pr-6 space-x-4">
					<div className="flex flex-col items-end justify-between">
						<span className="text-theme-secondary-500 dark:text-theme-secondary-700 text-sm">
							{t("COMMON.STATUS")}
						</span>
						<span>
							<span className={activeCount > 0 ? "text-theme-success-600" : "text-theme-danger-400"}>
								Active {activeCount}
							</span>
							<span className="text-theme-secondary-500 dark:text-theme-secondary-700">
								/{votes.length}
							</span>
						</span>
					</div>

					<Circle
						size="lg"
						className="border-theme-success-600 dark:border-theme-secondary-700 text-theme-success-600 dark:text-theme-secondary-700"
					>
						<Icon name="CheckmarkBig" width={16} height={15} />
					</Circle>
				</div>
			</>
		);
	};

	return (
		<div data-testid="WalletVote" className="w-full flex items-center">
			{votes.length === 0 ? (
				<>
					<Circle
						size="lg"
						className="border-theme-secondary-500 dark:border-theme-secondary-700 text-theme-secondary-500 dark:text-theme-secondary-700"
					>
						<Icon name="Vote" width={17} height={17} />
					</Circle>

					<div className="flex flex-1 ml-4">
						<div className="flex flex-col justify-between">
							<span className="font-semibold">
								{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.TITLE", { count: maxVotes })}
								<span className="ml-1 text-theme-secondary-500 dark:text-theme-secondary-700">
									{votes.length}/{maxVotes}
								</span>
							</span>

							<span className="leading-none">
								<span className="text-sm text-theme-secondary-500 dark:text-theme-secondary-700 mr-1">
									{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.EMPTY_DESCRIPTION")}
								</span>
								<Link to={votesHelpLink} showExternalIcon={false} isExternal>
									<span className="text-sm">{t("COMMON.LEARN_MORE")}</span>
								</Link>
							</span>
						</div>
					</div>
				</>
			) : (
				renderVotes()
			)}

			<Button
				data-testid="WalletVote__button"
				variant="secondary"
				className="space-x-2"
				onClick={() => onButtonClick()}
			>
				<Icon name="Vote" width={17} height={17} />
				<span>{t("COMMON.VOTE")}</span>
			</Button>
		</div>
	);
};

WalletVote.defaultProps = {
	votes: [],
	maxVotes: 1,
};
