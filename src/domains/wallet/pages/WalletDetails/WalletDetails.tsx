/* eslint-disable @typescript-eslint/require-await */
import { WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { WalletListItemProps } from "app/components/WalletListItem";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { Transaction, TransactionTable } from "domains/transaction/components/TransactionTable";
import { DeleteWallet } from "domains/wallet/components/DeleteWallet";
import { SignMessage } from "domains/wallet/components/SignMessage";
import { UpdateWalletName } from "domains/wallet/components/UpdateWalletName";
import { VerifyMessage } from "domains/wallet/components/VerifyMessage";
import { WalletBottomSheetMenu } from "domains/wallet/components/WalletBottomSheetMenu";
import { WalletHeader } from "domains/wallet/components/WalletHeader/WalletHeader";
import { WalletRegistrations } from "domains/wallet/components/WalletRegistrations";
import { WalletVote } from "domains/wallet/components/WalletVote";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { wallet, wallets } from "../../data";

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
	const [isSigningMessage, setIsSigningMessage] = useState(false);
	const [isVerifyingMessage, setIsVerifyingMessage] = useState(false);
	const [isSigned, setIsSigned] = useState(false);
	const [isDeleteWallet, setIsDeleteWallet] = useState(false);
	const [isUpdateWalletNameOpen, setIsUpdateWalletNameOpen] = useState(false);

	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();
	const history = useHistory();
	const { walletId } = useParams();

	const activeProfile = useActiveProfile();

	const dashboardRoute = `/profiles/${activeProfile?.id()}/dashboard`;
	const crumbs = [
		{
			route: dashboardRoute,
			label: "Go back to Portfolio",
		},
	];

	const handleDeleteWallet = async () => {
		const activeWallet = activeProfile?.wallets().findById(walletId);
		activeProfile?.wallets().forget(activeWallet?.id() as string);
		await persist();
		setIsDeleteWallet(false);
		history.push(dashboardRoute);
	};

	const handleUpdateName = async ({ name }: any) => {
		const wallet = activeProfile?.wallets().findById(walletId);
		wallet?.settings().set(WalletSetting.Alias, name);
		await persist();
		setIsUpdateWalletNameOpen(false);
	};

	const handleVerifymessage = () => {
		setIsVerifyingMessage(false);
	};

	/* istanbul ignore next */
	return (
		<>
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
					onUpdateWalletName={() => setIsUpdateWalletNameOpen(true)}
					onSignMessage={() => setIsSigningMessage(true)}
					onVerifyMessage={() => setIsVerifyingMessage(true)}
					onDeleteWallet={() => setIsDeleteWallet(true)}
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

				<Section>
					<div className="mb-16">
						<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.PENDING_TRANSACTIONS")}</h2>
						<TransactionTable transactions={wallet?.pendingTransactions || []} showSignColumn />
					</div>

					<div>
						<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY")}</h2>
						<TransactionTable transactions={wallet?.transactions || []} currencyRate="2" />
					</div>
				</Section>
			</Page>

			{wallets && wallets.length > 1 && <WalletBottomSheetMenu walletsData={wallets} />}

			<SignMessage
				isOpen={isSigningMessage}
				handleClose={() => setIsSigningMessage(false)}
				signatoryAddress={wallet?.address}
				handleSign={() => setIsSigned(true)}
				isSigned={isSigned}
			/>

			<DeleteWallet
				isOpen={isDeleteWallet}
				onClose={() => setIsDeleteWallet(false)}
				onCancel={() => setIsDeleteWallet(false)}
				onDelete={handleDeleteWallet}
			/>

			<UpdateWalletName
				isOpen={isUpdateWalletNameOpen}
				onSave={handleUpdateName}
				onClose={() => setIsUpdateWalletNameOpen(false)}
				onCancel={() => setIsUpdateWalletNameOpen(false)}
			/>

			<VerifyMessage
				isOpen={isVerifyingMessage}
				onClose={() => setIsVerifyingMessage(false)}
				onCancel={() => setIsVerifyingMessage(false)}
				onSubmit={handleVerifymessage}
				walletId={walletId}
				profileId={activeProfile?.id() as string}
			/>
		</>
	);
};

WalletDetails.defaultProps = {
	wallets,
	wallet,
};
