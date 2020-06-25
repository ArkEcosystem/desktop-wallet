import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Toggle } from "app/components/Toggle";
import React from "react";

import { Avatar } from "../Avatar";

type Props = {
	address: string;
	balance: string;
	coin: string;
	currencyBalance?: string;
	hasStarred?: boolean;
	isLedger?: boolean;
	isMultisig?: boolean;
	name?: string;
	publicKey?: string;
	onCopy?: () => void;
	onSend?: () => void;
	onMore?: () => void;
	onStar?: () => void;
};

export const WalletHeader = ({
	coin,
	hasStarred,
	name,
	address,
	publicKey,
	onSend,
	onMore,
	onStar,
	onCopy,
	balance,
	currencyBalance,
	isLedger,
	isMultisig,
}: Props) => {
	const [showPublicKey, setShowPublicKey] = React.useState(false);

	return (
		<header data-testid="WalletHeader">
			<div className="flex items-center justify-between px-12 py-6 theme-dark bg-theme-background text-theme-text">
				<div className="flex items-center space-x-4">
					<div className="flex">
						<Circle className="-mr-1 border-theme-neutral-light">
							<Icon name={coin} className="text-theme-neutral-light" />
						</Circle>
						<Avatar address={address} />
					</div>
					<h2 data-testid="WalletHeader__name" className="mb-0 text-theme-neutral-900">
						{name}
					</h2>
					{isLedger && (
						<span data-testid="WalletHeader__ledger">
							<Icon name="Ledger" className="text-theme-neutral-light" />
						</span>
					)}
					{isMultisig && (
						<span data-testid="WalletHeader__multisig">
							<Icon name="Multisig" className="text-theme-neutral-light" />
						</span>
					)}
				</div>
				<div className="flex items-stretch space-x-2">
					<button
						data-testid="WalletHeader__star-button"
						className="px-3 text-theme-neutral"
						onClick={onStar}
					>
						<Icon name={hasStarred ? "Star" : "StarOutline"} />
					</button>
					<Button data-testid="WalletHeader__send-button" onClick={onSend}>
						Send
					</Button>
					<Button data-testid="WalletHeader__more-button" onClick={onMore} variant="plain">
						<Icon name="Settings" />
					</Button>
				</div>
			</div>

			<ul className="flex items-stretch px-12 py-10 divide-x-1 divide-theme-neutral-300 space-x-8">
				<li className="space-y-2">
					<div className="inline-flex items-center space-x-2">
						<p
							className={`font-semibold text-sm ${
								!showPublicKey ? "text-theme-neutral-dark" : "text-theme-neutral-light"
							}`}
						>
							Address
						</p>
						<Toggle
							data-testid="WalletHeader__toggle"
							disabled={!publicKey}
							onChange={() => setShowPublicKey(!showPublicKey)}
						/>
						<p
							className={`font-semibold text-sm ${
								showPublicKey ? "text-theme-neutral-dark" : "text-theme-neutral-light"
							}`}
						>
							Public Key
						</p>
					</div>
					<div>
						<p data-testid="WalletHeader__address-publickey" className="inline-block text-lg font-medium">
							{showPublicKey ? publicKey : address}
						</p>
						<button
							data-testid="WalletHeader__copy-button"
							className="inline-block px-3 text-theme-neutral focus:outline-none"
							onClick={onCopy}
						>
							<Icon name="Copy" className="text-theme-primary-400" />
						</button>
					</div>
				</li>

				{!showPublicKey && (
					<li className="pl-8 space-y-2">
						<p className="text-sm font-semibold text-theme-neutral-dark">Balance</p>
						<p data-testid="WalletHeader__balance" className="text-lg font-medium">
							{balance}
						</p>
					</li>
				)}

				{!showPublicKey && currencyBalance && (
					<li className="pl-8 space-y-2">
						<p className="text-sm font-semibold text-theme-neutral-dark">Fiat</p>
						<p data-testid="WalletHeader__currency-balance" className="text-lg font-medium">
							{currencyBalance}
						</p>
					</li>
				)}
			</ul>
		</header>
	);
};
