import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

import { WalletVoteSkeleton } from "./WalletVoteSkeleton";

type WalletVoteProps = {
	isLoading?: boolean;
	isLoadingDelegates?: boolean;
	wallet: ReadWriteWallet;
	onButtonClick: (address?: string) => void;
};

const HintIcon = ({ tooltipContent }: { tooltipContent: string }) => (
	<Tooltip content={tooltipContent} className="mb-1">
		<span>
			<Icon
				name="InformationCircle"
				width={20}
				height={20}
				className="text-theme-primary-300 dark:text-theme-secondary-600"
			/>
		</span>
	</Tooltip>
);

export const WalletVote = ({ isLoading, isLoadingDelegates, wallet, onButtonClick }: WalletVoteProps) => {
	const { t } = useTranslation();

	if (isLoading) {
		return <WalletVoteSkeleton />;
	}

	const maxVotes = wallet.network().maximumVotesPerWallet();
	const activeDelegates = wallet.network().delegateCount();

	const votesHelpLink = "https://ark.dev/docs/desktop-wallet/user-guides/how-to-vote-unvote";

	let votes: ReadOnlyWallet[];

	try {
		votes = wallet.votes();
	} catch {
		votes = [];
	}

	const activeCount = votes.filter(
		(delegate: ReadOnlyWallet) => delegate.rank() && delegate.rank()! <= activeDelegates,
	).length;

	const renderStatuses = () => {
		if (activeCount === votes.length) {
			return (
				<span className="font-semibold text-theme-success-600">
					{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.ACTIVE", { count: maxVotes })}
				</span>
			);
		}

		if (activeCount === 0) {
			return (
				<>
					<HintIcon
						tooltipContent={t("WALLETS.PAGE_WALLET_DETAILS.VOTES.NOT_FORGING", { count: votes.length })}
					/>
					<span className="font-semibold text-theme-warning-500">
						{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.STANDBY", { count: maxVotes })}
					</span>
				</>
			);
		}

		const standbyCount = votes.length - activeCount;

		return (
			<>
				<HintIcon
					tooltipContent={t("WALLETS.PAGE_WALLET_DETAILS.VOTES.NOT_FORGING_COUNT", { count: standbyCount })}
				/>
				<span className="font-semibold">
					{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.ACTIVE_COUNT", { count: activeCount })}
					<span className="text-theme-secondary-500 dark:text-theme-secondary-700">
						&nbsp;/&nbsp;{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.STANDBY_COUNT", { count: standbyCount })}
					</span>
				</span>
			</>
		);
	};

	const renderVotes = () => {
		const delegate = votes[0];

		return (
			<>
				<Circle
					size="lg"
					shadowColor="--theme-secondary-background-color"
					className="border-theme-secondary-900 dark:border-theme-secondary-700 text-theme-secondary-900 dark:text-theme-secondary-700"
				>
					<Icon name="Vote" width={17} height={17} />
				</Circle>

				<div className="flex flex-1 ml-4">
					<div className="flex flex-col justify-between font-semibold">
						<span className="text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
							{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.VOTING_FOR")}
						</span>
						{votes.length === 1 ? (
							<span>{delegate.username()}</span>
						) : (
							<span
								className="transition-colors duration-200 cursor-pointer text-theme-primary-600 hover:text-theme-primary-700 active:text-theme-primary-500"
								onClick={() => onButtonClick("current")}
							>
								{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.MULTIVOTE")}
							</span>
						)}
					</div>

					{maxVotes === 1 && (
						<div className="flex flex-col justify-between pl-6 ml-6 font-semibold border-l border-theme-secondary-300 dark:border-theme-secondary-800">
							<span className="text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
								{t("COMMON.RANK")}
							</span>
							<span>{delegate.rank() ? `#${delegate.rank()}` : t("COMMON.NOT_AVAILABLE")}</span>
						</div>
					)}

					{maxVotes > 1 && (
						<div className="flex flex-col justify-between pl-6 ml-6 font-semibold border-l border-theme-secondary-300 dark:border-theme-secondary-800">
							<span className="text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
								{t("COMMON.VOTES")}
							</span>
							<span>
								{votes.length}
								<span className="text-theme-secondary-500 dark:text-theme-secondary-700">
									/{maxVotes}
								</span>
							</span>
						</div>
					)}
				</div>

				<div className="flex flex-col justify-between items-end pr-6 mr-6 font-semibold border-r border-theme-secondary-300 dark:border-theme-secondary-800">
					<span className="text-sm text-theme-secondary-500 dark:text-theme-secondary-700 ">
						{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.DELEGATE_STATUS")}
					</span>
					<div className="flex justify-end items-center space-x-2">{renderStatuses()}</div>
				</div>
			</>
		);
	};

	return (
		<div data-testid="WalletVote" className="flex items-center w-full">
			{votes.length === 0 ? (
				<>
					<Circle
						size="lg"
						shadowColor="--theme-secondary-background-color"
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
								<span className="mr-1 text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
									{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.EMPTY_DESCRIPTION")}
								</span>
								<Link to={votesHelpLink} isExternal>
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
				isLoading={isLoadingDelegates}
				disabled={isLoadingDelegates}
			>
				<Icon name="Vote" width={17} height={17} />
				<span>{t("COMMON.VOTE")}</span>
			</Button>
		</div>
	);
};

WalletVote.defaultProps = {
	votes: [],
};
