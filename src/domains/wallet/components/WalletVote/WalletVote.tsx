import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Collapse, CollapseToggleButton } from "app/components/Collapse";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	votes?: ReadOnlyWallet[];
	onUnvote?: (address: string) => void;
	defaultIsOpen?: boolean;
};

export const WalletVote = ({ votes, onUnvote, defaultIsOpen }: Props) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = React.useState(defaultIsOpen!);

	const hasNoVotes = !votes || votes.length === 0;

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
				<div className="grid grid-flow-row row-gap-6 py-4">
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
								<div className="font-semibold text-theme-neutral-900">
									<span className="mr-2">
										{t("WALLETS.PAGE_WALLET_DETAILS.VOTES.EMPTY.DESCRIPTION")}
									</span>
									<Link to="https://guides.ark.dev/usage-guides/desktop-wallet-voting" isExternal>
										{t("COMMON.LEARN_MORE")}
									</Link>
								</div>
							</div>
						</div>
					) : (
						votes?.map((delegate: ReadOnlyWallet) => (
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
												href={delegate.explorerLink()}
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
