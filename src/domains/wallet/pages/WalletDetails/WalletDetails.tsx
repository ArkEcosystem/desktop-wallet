/* eslint-disable @typescript-eslint/require-await */
import { ExtendedTransactionData, ProfileSetting, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Page, Section } from "app/components/Layout";
import { Spinner } from "app/components/Spinner";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { MultiSignatureDetail } from "domains/transaction/components/MultiSignatureDetail";
import { TransactionDetailModal } from "domains/transaction/components/TransactionDetailModal";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import { SignedTransactionTable } from "domains/transaction/components/TransactionTable/SignedTransactionTable/SignedTransactionTable";
import { DeleteWallet } from "domains/wallet/components/DeleteWallet";
import { SignMessage } from "domains/wallet/components/SignMessage";
import { UpdateWalletName } from "domains/wallet/components/UpdateWalletName";
import { VerifyMessage } from "domains/wallet/components/VerifyMessage";
import { WalletBottomSheetMenu } from "domains/wallet/components/WalletBottomSheetMenu";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { WalletHeader, WalletRegistrations, WalletVote } from "./components";
import { useWalletTransactions } from "./hooks/use-wallet-transactions";

type WalletDetailsProps = {
	txSkeletonRowsLimit?: number;
	transactionLimit?: number;
};

export const WalletDetails = ({ txSkeletonRowsLimit, transactionLimit }: WalletDetailsProps) => {
	const [isUpdateWalletName, setIsUpdateWalletName] = useState(false);
	const [isSigningMessage, setIsSigningMessage] = useState(false);
	const [isDeleteWallet, setIsDeleteWallet] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isVerifyingMessage, setIsVerifyingMessage] = useState(false);

	const [signedTransactionModalItem, setSignedTransactionModalItem] = useState<SignedTransactionData | undefined>(
		undefined,
	);
	const [transactionModalItem, setTransactionModalItem] = useState<ExtendedTransactionData | undefined>(undefined);

	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();
	const history = useHistory();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const {
		pendingMultiSignatureTransactions,
		transactions,
		fetchInit,
		fetchMore,
		isLoading: isLoadingTransactions,
		hasMore,
	} = useWalletTransactions(activeWallet, { limit: transactionLimit! });

	const walletVotes = () => {
		// Being synced in background and will be updated after persisting
		try {
			return activeWallet.votes();
		} catch (e) {
			return [];
		}
	};

	const wallets = useMemo(() => activeProfile.wallets().values(), [activeProfile]);

	const [showWalletVote, setShowWalletVote] = useState(false);
	const [showWalletRegistrations, setShowWalletRegistrations] = useState(false);

	useLayoutEffect(() => {
		setShowWalletVote(activeWallet.network().can("Transaction.vote"));
		setShowWalletRegistrations(
			activeWallet.network().can("Transaction.secondSignature") ||
				activeWallet.network().can("Transaction.delegateRegistration") ||
				activeWallet.network().can("Transaction.entityRegistration"),
		);
	}, [activeWallet]);

	const coinName = activeWallet.coinId();
	const networkId = activeWallet.networkId();
	const ticker = activeWallet.currency();
	const exchangeCurrency = activeProfile.settings().get<string>(ProfileSetting.ExchangeCurrency);

	const dashboardRoute = `/profiles/${activeProfile.id()}/dashboard`;

	const crumbs = [
		{
			route: dashboardRoute,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	useEffect(() => {
		const fetchAllData = async () => {
			setIsLoading(true);
			await fetchInit();
			setIsLoading(false);
		};
		fetchAllData();
	}, [fetchInit]);

	const handleDeleteWallet = async () => {
		activeProfile.wallets().forget(activeWallet.id());
		await persist();
		setIsDeleteWallet(false);
		history.push(dashboardRoute);
	};

	const handleUpdateName = async (name: string) => {
		if (name) {
			activeWallet.settings().set(WalletSetting.Alias, name);
		} else {
			activeWallet.settings().forget(WalletSetting.Alias);
		}

		await persist();

		setIsUpdateWalletName(false);
	};

	const handleStar = async () => {
		activeWallet.toggleStarred();
		await persist();
	};

	const handleVoteButton = (address?: string) => {
		/* istanbul ignore else */
		if (address) {
			return history.push({
				pathname: `/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/send-vote`,
				search: `?unvotes=${address}`,
			});
		}

		/* istanbul ignore next */
		history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/votes`);
	};

	const handleRegistrationsButton = (newRegistration?: boolean) => {
		if (newRegistration) {
			return history.push(
				`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/send-entity-registration`,
			);
		}

		history.push(`/profiles/${activeProfile.id()}/registrations`);
	};

	/* istanbul ignore next */
	return (
		<>
			<Page profile={activeProfile} crumbs={crumbs}>
				<WalletHeader
					address={activeWallet.address()}
					balance={activeWallet.balance()}
					coin={coinName}
					currencyBalance={activeWallet.convertedBalance()}
					exchangeCurrency={exchangeCurrency}
					isLedger={activeWallet.isLedger()}
					isMultisig={activeWallet.hasSyncedWithNetwork() && activeWallet.isMultiSignature()}
					isStarred={activeWallet.isStarred()}
					name={activeWallet.alias()}
					network={networkId}
					publicKey={activeWallet.publicKey()}
					ticker={ticker}
					showSignMessageOption={activeWallet.network().can("Message.sign")}
					showStoreHashOption={activeWallet.network().can("Transaction.ipfs")}
					showVerifyMessageOption={activeWallet.network().can("Message.verify")}
					onDeleteWallet={() => setIsDeleteWallet(true)}
					onSend={() =>
						history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/send-transfer`)
					}
					onSignMessage={() => setIsSigningMessage(true)}
					onStar={handleStar}
					onStoreHash={() =>
						history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/send-ipfs`)
					}
					onUpdateWalletName={() => setIsUpdateWalletName(true)}
					onVerifyMessage={() => setIsVerifyingMessage(true)}
				/>

				{(showWalletVote || showWalletRegistrations) && (
					<Section marginTop={false}>
						<div className="flex">
							{showWalletVote && (
								<div className="flex-1 pr-12 last:pr-0">
									<WalletVote
										votes={activeWallet.hasSyncedWithNetwork() ? walletVotes() : []}
										maxVotes={activeWallet.network().maximumVotesPerWallet()}
										isLoading={isLoading}
										onButtonClick={handleVoteButton}
									/>
								</div>
							)}

							{showWalletRegistrations && (
								<div className="flex-1 pl-12 first:pl-0 even:border-l border-theme-neutral-300 dark:border-theme-neutral-800">
									<WalletRegistrations
										delegate={
											activeWallet.hasSyncedWithNetwork() && activeWallet.isDelegate()
												? {
														username: activeWallet.username(),
														isResigned: activeWallet.isResignedDelegate(),
												  }
												: undefined
										}
										entities={activeWallet.hasSyncedWithNetwork() ? activeWallet.entities() : []}
										isLoading={isLoading}
										isMultiSignature={
											activeWallet.hasSyncedWithNetwork() && activeWallet.isMultiSignature()
										}
										isSecondSignature={
											activeWallet.hasSyncedWithNetwork() && activeWallet.isSecondSignature()
										}
										onButtonClick={handleRegistrationsButton}
									/>
								</div>
							)}
						</div>
					</Section>
				)}

				<Section className="flex-1" marginTop={showWalletVote || showWalletRegistrations}>
					{pendingMultiSignatureTransactions.length > 0 && (
						<div className="mb-16">
							<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.PENDING_TRANSACTIONS")}</h2>
							<SignedTransactionTable
								transactions={pendingMultiSignatureTransactions}
								wallet={activeWallet}
								onClick={setSignedTransactionModalItem}
							/>
						</div>
					)}

					<div>
						<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY.TITLE")}</h2>
						<>
							<TransactionTable
								transactions={transactions}
								exchangeCurrency={exchangeCurrency}
								hideHeader={!isLoading && transactions.length === 0}
								isLoading={isLoading}
								skeletonRowsLimit={txSkeletonRowsLimit}
								onRowClick={(row) => setTransactionModalItem(row)}
							/>

							{transactions.length > 0 && hasMore && (
								<Button
									data-testid="transactions__fetch-more-button"
									variant="plain"
									className="w-full mt-10 mb-5"
									onClick={() => fetchMore()}
								>
									{isLoadingTransactions ? <Spinner size="sm" /> : t("COMMON.VIEW_MORE")}
								</Button>
							)}

							{!isLoading && transactions.length === 0 && (
								<EmptyBlock className="-mt-2">
									{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY.EMPTY_MESSAGE")}
								</EmptyBlock>
							)}
						</>
					</div>
				</Section>
			</Page>

			{wallets && wallets.length > 1 && <WalletBottomSheetMenu wallets={wallets} />}

			<UpdateWalletName
				wallet={activeWallet}
				profile={activeProfile}
				isOpen={isUpdateWalletName}
				onClose={() => setIsUpdateWalletName(false)}
				onCancel={() => setIsUpdateWalletName(false)}
				onSave={handleUpdateName}
			/>

			<SignMessage
				profileId={activeProfile.id()}
				walletId={activeWallet.id()}
				signatoryAddress={activeWallet.address()}
				isOpen={isSigningMessage}
				onClose={() => setIsSigningMessage(false)}
				onCancel={() => setIsSigningMessage(false)}
			/>

			<DeleteWallet
				isOpen={isDeleteWallet}
				onClose={() => setIsDeleteWallet(false)}
				onCancel={() => setIsDeleteWallet(false)}
				onDelete={handleDeleteWallet}
			/>

			<VerifyMessage
				isOpen={isVerifyingMessage}
				onClose={() => setIsVerifyingMessage(false)}
				onCancel={() => setIsVerifyingMessage(false)}
				walletId={activeWallet.id()}
				profileId={activeProfile.id()}
				signatory={activeWallet.publicKey()}
			/>

			{signedTransactionModalItem && (
				<MultiSignatureDetail
					wallet={activeWallet}
					isOpen={!!signedTransactionModalItem}
					transaction={signedTransactionModalItem}
					onClose={() => setSignedTransactionModalItem(undefined)}
				/>
			)}

			{transactionModalItem && (
				<TransactionDetailModal
					isOpen={!!transactionModalItem}
					transactionItem={transactionModalItem}
					onClose={() => setTransactionModalItem(undefined)}
				/>
			)}
		</>
	);
};

WalletDetails.defaultProps = {
	txSkeletonRowsLimit: 8,
	transactionLimit: 15,
};
