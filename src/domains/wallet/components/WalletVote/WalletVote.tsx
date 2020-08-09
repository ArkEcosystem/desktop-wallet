import { Coins } from "@arkecosystem/platform-sdk";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Collapse, CollapseToggleButton } from "app/components/Collapse";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	votes?: Coins.WalletDataCollection;
	onUnvote?: (address: string) => void;
	defaultIsOpen?: boolean;
};

// TODO: Delegate Explorer URL
export const WalletVote = ({ votes, onUnvote, defaultIsOpen }: Props) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = React.useState(defaultIsOpen!);

	const hasNoVotes = !votes || votes.items().length === 0;

	return (
		<section data-testid="WalletVote">
			<div className="flex items-center justify-between">
				<h2 className="font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.TITLE")}</h2>
				<CollapseToggleButton
					data-testid="WalletVote__toggle"
					className="-mr-4 text-theme-neutral"
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				/>
			</div>

			<Collapse isOpen={isOpen}>
				<div className="py-4 grid grid-flow-row row-gap-6">
					{hasNoVotes ? (
						<div data-testid="WalletVote__empty" className="flex items-center pr-8 space-x-4">
							<div className="flex items-center -space-x-2">
								<Circle size="lg" className="text-theme-neutral-light">
									<Icon name="Voted" />
								</Circle>
								<Circle size="lg" className="bg-theme-background" />
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-semibold text-theme-neutral">
									{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.EMPTY.LABEL")}
								</span>
								<span className="font-semibold text-theme-neutral-900">
									{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.EMPTY.DESCRIPTION")}
									<a href="/#" className="px-2 text-theme-primary">
										{t("COMMON.LEARN_MORE")}
									</a>
								</span>
							</div>
						</div>
					) : (
						votes?.items().map((delegate) => (
							<div
								data-testid="WalletVote__delegate"
								className="flex items-center justify-between"
								key={delegate.address()}
							>
								<div className="flex items-center space-x-4">
									<div className="flex items-center -space-x-2">
										<Circle size="lg" className="border-theme-neutral-900 text-theme-neutral-900">
											<Icon name="Voted" />
										</Circle>
										<Avatar size="lg" address={delegate.address()} />
									</div>
									<div className="flex flex-col justify-between">
										<span className="text-sm font-semibold text-theme-neutral">
											{t("COMMON.DELEGATE")}
										</span>
										<Address walletName={delegate.username()} address={delegate.address()} />
									</div>
								</div>

								<div className="flex items-center">
									<ul className="flex items-stretch divide-x-1 divide-theme-neutral-300">
										<li className="flex flex-col items-center justify-between px-10">
											<span className="text-sm font-semibold text-theme-neutral">
												{t("COMMON.RANK")}
											</span>
											<span
												data-testid="WalletVote__delegate__rank"
												className="font-bold text-theme-neutral-dark"
											>
												#{delegate.rank()}
											</span>
										</li>

										<li className="flex flex-col items-center justify-between px-10">
											<span className="text-sm font-semibold text-theme-neutral">
												{t("COMMON.EXPLORER")}
											</span>
											<a
												data-testid="WalletVote__delegate__explorer"
												href="https://explorer.ark.io"
												target="_blank"
												rel="noopener noreferrer"
											>
												<Icon name="Explorer" className="text-2xl text-theme-primary" />
											</a>
										</li>

										<li className="flex flex-col items-center justify-between px-10">
											<span className="text-sm font-semibold text-theme-neutral">
												{t("COMMON.MARKETSQUARE")}
											</span>
											<a
												data-testid="WalletVote__delegate__msq"
												href="https://marketsquare.io"
												target="_blank"
												rel="noopener noreferrer"
											>
												<Icon name="Link" className="text-xl text-theme-primary" />
											</a>
										</li>

										<li className="flex flex-col items-center justify-between px-10">
											<span className="text-sm font-semibold text-theme-neutral">
												{t("COMMON.STATUS")}
											</span>
											<Icon
												name={delegate.rank() ? "Ok" : "StatusClock"}
												className={
													delegate.rank() ? "text-theme-success" : "text-theme-neutral"
												}
											/>
										</li>
									</ul>

									<Button
										data-testid="WalletVote__delegate__unvote"
										variant="plain"
										onClick={() => onUnvote?.(delegate.address())}
									>
										{t("COMMON.UNVOTE")}
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</Collapse>
		</section>
	);
};

WalletVote.defaultProps = {
	defaultIsOpen: true,
};
