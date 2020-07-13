import { Page, Section } from "app/components/Layout";
import { WalletListItemProps } from "app/components/WalletListItem";
import { useActiveProfile } from "app/hooks/env";
import { Transaction, TransactionTable } from "domains/transaction/components/TransactionTable";
import { SignMessage } from "domains/wallet/components/SignMessage";
import { WalletBottomSheetMenu } from "domains/wallet/components/WalletBottomSheetMenu";
import { WalletHeader } from "domains/wallet/components/WalletHeader/WalletHeader";
import { WalletRegistrations } from "domains/wallet/components/WalletRegistrations";
import { WalletVote } from "domains/wallet/components/WalletVote";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { wallet, wallets } from "./data";

type Wallet = WalletListItemProps & {
	address: string;
	balance: string;
	publicKey?: string;
	hasStarred?: boolean;
	transactions?: Transaction[];
	pendingTransactions?: Transaction[];
	delegates: {
		username: string;
		address: string;
		rank: number;
		isActive?: boolean;
		explorerUrl?: string;
		msqUrl?: string;
	}[];
	business?: {
		name: string;
	};
};

type Props = {
	wallets?: Wallet[];
	wallet?: Wallet;
};

export const WalletDetails = ({ wallet, wallets }: Props) => {
	const activeProfile = useActiveProfile();
	const history = useHistory();
	const [isSigningMessage, setIsSigningMessage] = useState(false);
	const [isSigned, setIsSigned] = useState(false);

	const crumbs = [
		{
			route: `/profiles/${activeProfile?.id()}/dashboard`,
			label: "Go back to Portfolio",
		},
	];

	/* istanbul ignore next */
	return (
		<Page crumbs={crumbs}>
			<WalletHeader
				coin={wallet?.coinIcon || "Ark"}
				address={wallet?.address}
				publicKey={wallet?.publicKey}
				balance={wallet?.balance}
				currencyBalance={wallet?.fiat}
				name={wallet?.walletName}
				isLedger={wallet?.walletTypeIcons?.includes("Ledger")}
				isMultisig={wallet?.walletTypeIcons?.includes("Multisig")}
				hasStarred={wallet?.hasStarred}
				onSend={() => history.push(`/profiles/${activeProfile?.id()}/transactions/transfer`)}
				onSignMessage={() => setIsSigningMessage(true)}
			/>

			<Section>
				<WalletVote delegates={wallet?.delegates || []} />
			</Section>

			<Section>
				<WalletRegistrations
					address={wallet?.address}
					delegate={wallet?.delegates?.[0]}
					business={wallet?.business}
					isMultisig={wallet?.walletTypeIcons?.includes("Multisig")}
					hasBridgechains={wallet?.walletTypeIcons?.includes("Bridgechain")}
					hasSecondSignature={wallet?.walletTypeIcons?.includes("Key")}
					hasPlugins={wallet?.walletTypeIcons?.includes("Plugins")}
					onShowAll={() => history.push(`/profiles/${activeProfile?.id()}/registrations`)}
					onRegister={() => history.push(`/profiles/${activeProfile?.id()}/transactions/registration`)}
				/>
			</Section>

			<div>
				<Section className="mb-20">
					<div className="mb-16">
						<h2 className="font-bold">Pending Transactions</h2>
						<TransactionTable transactions={wallet?.pendingTransactions || []} showSignColumn />
					</div>

					<div>
						<h2 className="font-bold">Transaction History</h2>
						<TransactionTable transactions={wallet?.transactions || []} currencyRate="2" />
					</div>
				</Section>
			</div>

			<WalletBottomSheetMenu walletsData={wallets!} />
			<SignMessage
				isOpen={isSigningMessage}
				handleClose={() => setIsSigningMessage(false)}
				signatoryAddress={wallet?.address}
				handleSign={() => setIsSigned(true)}
				isSigned={isSigned}
			/>
		</Page>
	);
};

WalletDetails.defaultProps = {
	wallets,
	wallet,
};
