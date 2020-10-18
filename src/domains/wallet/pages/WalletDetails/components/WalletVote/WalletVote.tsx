import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import React from "react";
import { useTranslation } from "react-i18next";

import { WalletVoteSkeleton } from "./WalletVoteSkeleton";

type WalletVoteProps = {
	votes: ReadOnlyWallet[];
	maxVotes: number;
	isLoading?: boolean;
	onButtonClick: (address?: string) => void;
};

export const WalletVote = ({ votes, maxVotes, isLoading, onButtonClick }: WalletVoteProps) => {
	const { t } = useTranslation();

	const hasNoVotes = votes.length === 0;

	const renderVotes = () => {
		if (hasNoVotes) {
			return (
				<div data-testid="WalletVote__empty" className="flex items-center space-x-4">
					<div className="flex items-center -space-x-2">
						<Circle size="lg" className="text-theme-neutral-light">
							<Icon name="Vote" width={21} height={21} />
						</Circle>

						<div className="flex -space-x-3">
							<span className="inline-block">
								<Circle size="lg" />
							</span>
							{maxVotes > 1 && (
								<span className="inline-block">
									<Circle size="lg" />
								</span>
							)}
						</div>
					</div>

					<div className="flex justify-between flex-1">
						<div className="flex flex-col mr-4 font-semibold text-theme-text">
							<span>{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.EMPTY_DESCRIPTION")}</span>

							<div className="mr-auto">
								<Link
									to="https://guides.ark.dev/usage-guides/desktop-wallet-voting"
									isExternal
									showExternalIcon={false}
								>
									{t("COMMON.LEARN_MORE")}
								</Link>
							</div>
						</div>

						<Button variant="plain" onClick={() => onButtonClick()} data-testid="WalletVote__button">
							{t("COMMON.VOTE")}
						</Button>
					</div>
				</div>
			);
		}

		if (votes && votes.length === 1) {
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

					<div className="flex flex-col justify-between h-full ml-4 mr-8">
						<span className="text-sm font-semibold text-theme-neutral">{t("COMMON.DELEGATE")}</span>

						<Address walletName={delegate.username()} />
					</div>

					<div className="flex flex-col items-center justify-between h-full pl-8 border-l border-theme-neutral-300 dark:border-theme-neutral-800">
						<span className="text-sm font-semibold text-theme-neutral">{t("COMMON.STATUS")}</span>

						{rank ? (
							<Tippy content={`#${rank}`} placement="right">
								<span>
									<Icon name="StatusOk" className="text-theme-success" />
								</span>
							</Tippy>
						) : (
							<Icon name="StatusClock" className="text-theme-neutral" />
						)}
					</div>

					<Button
						variant="plain"
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
			<Tippy content={username}>
				<span className="inline-block">
					<Avatar size="lg" address={address} />
				</span>
			</Tippy>
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

						{rest && rest.length === 1 && renderAvatar(rest[0].address(), rest[0].username())}

						{rest && rest.length > 1 && (
							<Circle size="lg" className="relative border-theme-text text-theme-text">
								<span className="font-semibold">+{rest.length}</span>
							</Circle>
						)}
					</div>
				</div>

				<Button
					variant="plain"
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
				{!isLoading && (
					<span className="ml-1 text-2xl font-bold text-theme-neutral-light">
						({votes.length}/{maxVotes})
					</span>
				)}
			</div>

			{isLoading ? <WalletVoteSkeleton /> : renderVotes()}
		</section>
	);
};

WalletVote.defaultProps = {
	votes: [],
	maxVotes: 1,
};
