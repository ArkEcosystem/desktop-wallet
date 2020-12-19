import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

import { WalletVoteSkeleton } from "./WalletVoteSkeleton";

type WalletVoteProps = {
	wallet: ReadWriteWallet;
	onButtonClick: (address?: string) => void;
};

export const WalletVote = ({ wallet, onButtonClick }: WalletVoteProps) => {
	const { t } = useTranslation();

	if (!wallet.hasSyncedWithNetwork()) {
		return <section data-testid="WalletVote">{<WalletVoteSkeleton />}</section>;
	}

	let votes: ReadOnlyWallet[];

	try {
		votes = wallet.votes();
	} catch {
		votes = [];
	}

	const maxVotes = wallet.network().maximumVotesPerWallet();

	const hasNoVotes = votes.length === 0;
	const votesHelpLink = "https://ark.dev/docs/desktop-wallet/user-guides/how-to-vote-unvote";

	const renderVotes = () => {
		if (hasNoVotes) {
			return (
				<div data-testid="WalletVote__empty" className="flex items-center space-x-4">
					<div className="flex items-center -space-x-2">
						<Circle
							size="lg"
							className="border-theme-neutral-500 dark:border-theme-neutral-700 text-theme-neutral-500 dark:text-theme-neutral-700"
						>
							<Icon name="Vote" width={21} height={21} />
						</Circle>

						<div className="flex -space-x-3">
							<span className="inline-block">
								<Circle size="lg" className="border-theme-neutral-500 dark:border-theme-neutral-700" />
							</span>
							{maxVotes > 1 && (
								<span className="inline-block">
									<Circle
										size="lg"
										className="border-theme-neutral-500 dark:border-theme-neutral-700"
									/>
								</span>
							)}
						</div>
					</div>

					<div className="flex flex-1 justify-between">
						<div className="flex flex-col mr-4 font-semibold leading-snug text-theme-text">
							<span className="mr-2">{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.EMPTY_DESCRIPTION")}</span>

							<div className="mt-1 mr-auto">
								<Link to={votesHelpLink} isExternal>
									{t("COMMON.LEARN_MORE")}
								</Link>
							</div>
						</div>

						<Button variant="secondary" onClick={() => onButtonClick()} data-testid="WalletVote__button">
							{t("COMMON.VOTE")}
						</Button>
					</div>
				</div>
			);
		}

		if (votes.length === 1) {
			const delegate = votes[0];
			const rank = delegate.rank();

			return (
				<div className="flex items-center h-11">
					<div className="flex items-center -space-x-2">
						<Circle size="lg" className="border-theme-text text-theme-text">
							<Icon name="Vote" width={21} height={21} />
						</Circle>
						<Avatar size="lg" address={delegate.address()} />
					</div>

					<div className="flex flex-col justify-between mr-8 ml-4 h-full">
						<span className="text-sm font-semibold text-theme-neutral">{t("COMMON.DELEGATE")}</span>

						<Address walletName={delegate.username()} />
					</div>

					<div className="flex flex-col justify-between items-center pl-8 h-full border-l border-theme-neutral-300 dark:border-theme-neutral-800">
						<span className="text-sm font-semibold text-theme-neutral">{t("COMMON.STATUS")}</span>

						{rank ? (
							<Tooltip content={`#${rank}`} placement="right">
								<span>
									<Icon name="StatusOk" className="text-theme-success" width={20} height={20} />
								</span>
							</Tooltip>
						) : (
							<Icon name="StatusPending" className="text-theme-warning" width={20} height={20} />
						)}
					</div>

					<Button
						variant="secondary"
						className="ml-auto"
						onClick={() => onButtonClick(delegate.address())}
						data-testid="WalletVote__button"
					>
						{t("COMMON.UNVOTE")}
					</Button>
				</div>
			);
		}

		const [first, second, ...rest] = votes;

		const renderAvatar = (address: string, username?: string) => (
			<Tooltip content={username}>
				<span className="inline-block">
					<Avatar size="lg" address={address} />
				</span>
			</Tooltip>
		);

		return (
			<div className="flex items-center h-11">
				<div className="flex items-center -space-x-2">
					<Circle size="lg" className="border-theme-text text-theme-text">
						<Icon name="Vote" width={21} height={21} />
					</Circle>

					<div className="flex -space-x-3">
						{renderAvatar(first.address(), first.username())}

						{second && renderAvatar(second.address(), second.username())}

						{rest?.length === 1 && renderAvatar(rest[0].address(), rest[0].username())}

						{rest?.length > 1 && (
							<Circle size="lg" className="relative border-theme-text text-theme-text">
								<span className="font-semibold">+{rest.length}</span>
							</Circle>
						)}
					</div>
				</div>

				<Button
					variant="secondary"
					className="ml-auto"
					onClick={() => onButtonClick()}
					data-testid="WalletVote__button"
				>
					{t("COMMON.SHOW_ALL")}
				</Button>
			</div>
		);
	};

	return (
		<section data-testid="WalletVote">
			<div className="flex mb-4">
				<h2 className="mb-0 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.TITLE", { count: maxVotes })}</h2>
				<span className="ml-1 text-2xl font-bold text-theme-neutral-500 dark:text-theme-neutral-700">
					({votes.length}/{maxVotes})
				</span>
			</div>

			{renderVotes()}
		</section>
	);
};

WalletVote.defaultProps = {
	votes: [],
	maxVotes: 1,
};
