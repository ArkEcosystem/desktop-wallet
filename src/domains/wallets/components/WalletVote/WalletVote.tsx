import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Collapse, CollapseToggleButton } from "app/components/Collapse";
import { Icon } from "app/components/Icon";
import React from "react";

import { Avatar } from "../Avatar";

type Props = {
	delegates: {
		username: string;
		address: string;
		rank: number;
		isActive?: boolean;
		explorerUrl?: string;
		msqUrl?: string;
	}[];
	onUnvote?: (address: string) => void;
	defaultIsOpen?: boolean;
};

export const WalletVote = ({ delegates, onUnvote, defaultIsOpen }: Props) => {
	const [isOpen, setIsOpen] = React.useState(defaultIsOpen!);

	return (
		<section data-testid="WalletVote" className="px-12 py-8">
			<div className="flex items-center justify-between">
				<h2 className="font-bold">My Vote</h2>
				<CollapseToggleButton
					data-testid="WalletVote__toggle"
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				/>
			</div>

			<Collapse isOpen={isOpen}>
				<div className="px-1 py-4 grid grid-flow-row row-gap-6">
					{delegates.map(({ address, username, rank, isActive, explorerUrl, msqUrl }) => (
						<div
							data-testid="WalletVote__delegate"
							className="flex items-center justify-between"
							key={address}
						>
							<div className="flex items-center space-x-4">
								<div className="flex items-center -space-x-2">
									<Circle size="large" className="border-theme-neutral-900 text-theme-neutral-900">
										<Icon name="Voted" />
									</Circle>
									<Avatar size="large" address={address} />
								</div>
								<div>
									<p className="text-sm font-semibold text-theme-neutral space-y-1">
										Address Delegate
									</p>
									<Address walletName={username} address={address} />
								</div>
							</div>

							<div className="flex items-center">
								<ul className="flex items-stretch divide-x-1 divide-theme-neutral-300">
									<li className="flex flex-col items-center px-10 space-y-1">
										<p className="text-sm font-semibold text-theme-neutral">Rank</p>
										<span
											data-testid="WalletVote__delegate__rank"
											className="font-bold text-theme-neutral-dark"
										>
											#{rank}
										</span>
									</li>

									{explorerUrl && (
										<li className="flex flex-col items-center px-10 space-y-1">
											<p className="text-sm font-semibold text-theme-neutral">Explorer</p>
											<a
												data-testid="WalletVote__delegate__explorer"
												href={explorerUrl}
												target="_blank"
												rel="noreferrer"
											>
												<Icon name="Explorer" className="text-2xl text-theme-primary" />
											</a>
										</li>
									)}

									{msqUrl && (
										<li className="flex flex-col items-center px-10 space-y-1">
											<p className="text-sm font-semibold text-theme-neutral">Marketpl.</p>
											<a
												data-testid="WalletVote__delegate__msq"
												href={msqUrl}
												target="_blank"
												rel="noreferrer"
											>
												<Icon name="Link" className="text-xl text-theme-primary" />
											</a>
										</li>
									)}

									<li className="flex flex-col items-center px-10 space-y-1">
										<p className="text-sm font-semibold text-theme-neutral">Status</p>
										<Icon
											name={isActive ? "Ok" : "StatusClock"}
											className={isActive ? "text-theme-success" : "text-theme-neutral"}
										/>
									</li>
								</ul>

								<Button
									data-testid="WalletVote__delegate__unvote"
									variant="plain"
									onClick={() => onUnvote?.(address)}
								>
									Unvote
								</Button>
							</div>
						</div>
					))}
				</div>
			</Collapse>
		</section>
	);
};

WalletVote.defaultProps = {
	defaultIsOpen: true,
};
