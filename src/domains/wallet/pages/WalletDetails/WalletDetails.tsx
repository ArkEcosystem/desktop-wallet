/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk";
import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { ProfileSetting, ReadOnlyWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import { DeleteWallet } from "domains/wallet/components/DeleteWallet";
import { SignMessage } from "domains/wallet/components/SignMessage";
import { UpdateWalletName } from "domains/wallet/components/UpdateWalletName";
import { VerifyMessage } from "domains/wallet/components/VerifyMessage";
import { WalletBottomSheetMenu } from "domains/wallet/components/WalletBottomSheetMenu";
import { WalletHeader } from "domains/wallet/components/WalletHeader/WalletHeader";
import { WalletRegistrations } from "domains/wallet/components/WalletRegistrations";
import { WalletVote } from "domains/wallet/components/WalletVote";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

type WalletDetailsProps = {
	txSkeletonRowsLimit?: number;
};

type WalletInfo = {
	transactions: ExtendedTransactionData[];
	walletData?: Contracts.WalletData;
	votes?: ReadOnlyWallet[];
};

export const WalletDetails = ({ txSkeletonRowsLimit }: WalletDetailsProps) => {
	const [data, setData] = useState<WalletInfo>({ transactions: [] });

	const [isUpdateWalletName, setIsUpdateWalletName] = useState(false);
	const [isSigningMessage, setIsSigningMessage] = useState(false);
	const [isDeleteWallet, setIsDeleteWallet] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isVerifyingMessage, setIsVerifyingMessage] = useState(false);

	const { t } = useTranslation();
	const { env, persist } = useEnvironmentContext();
	const history = useHistory();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const wallets = useMemo(() => activeProfile.wallets().values(), [activeProfile]);

	const coinName = activeWallet.coinId();
	const networkId = activeWallet.networkId();
	const ticker = activeWallet.currency();
	const exchangeCurrency = activeProfile.settings().get<string>(ProfileSetting.ExchangeCurrency);
	const { transactions, walletData, votes } = data;
	const dashboardRoute = `/profiles/${activeProfile.id()}/dashboard`;
	const crumbs = [
		{
			route: dashboardRoute,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	useEffect(() => {
		const fetchAllData = async () => {
			const transactions = (await activeWallet.transactions({ limit: 10 })).items();

			let walletData: Contracts.WalletData | undefined;
			let votes: ReadOnlyWallet[] = [];

			try {
				walletData = await activeWallet.client().wallet(activeWallet.address());
				votes = activeWallet.votes();
			} catch {
				votes = [];
			}

			setData({
				walletData,
				transactions,
				votes,
			});

			setIsLoading(false);
		};

		fetchAllData();
	}, [activeWallet, env]);

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

	const fetchMoreTransactions = async (type?: string) => {
		//TODO: Fetch more type based / ex: pending and confirmed txs
		const nextPage = (await activeProfile.transactionAggregate().transactions({ limit: 10 })).items();

		return transactions && setData({ ...data, transactions: transactions?.concat(nextPage) });
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

				<Section>
					<WalletVote
						votes={votes}
						isLoading={isLoading}
						onVote={() =>
							history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/votes`)
						}
						onUnvote={(delegateAddress) =>
							history.push({
								pathname: `/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/send-vote`,
								search: `?unvotes=${delegateAddress}`,
							})
						}
					/>
				</Section>

				<Section>
					<WalletRegistrations
						isLoading={isLoading}
						delegate={
							activeWallet.hasSyncedWithNetwork() && activeWallet.isDelegate() ? walletData : undefined
						}
						business={undefined}
						isMultisig={activeWallet.hasSyncedWithNetwork() && activeWallet.isMultiSignature()}
						hasBridgechains={true}
						hasSecondSignature={activeWallet.hasSyncedWithNetwork() && activeWallet.isSecondSignature()}
						hasPlugins={true}
						onShowAll={() => history.push(`/profiles/${activeProfile.id()}/registrations`)}
						onRegister={() =>
							history.push(
								`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/send-entity-registration`,
							)
						}
					/>
				</Section>

				<Section>
					<div className="mb-16">
						<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.PENDING_TRANSACTIONS")}</h2>
						{/* TODO: Deal with pending transactions once SDK methods for it are available */}
						<>
							<TransactionTable
								transactions={transactions}
								showSignColumn
								isLoading={isLoading}
								skeletonRowsLimit={txSkeletonRowsLimit}
							/>
							{transactions.length > 0 && (
								<Button
									data-testid="pending-transactions__fetch-more-button"
									variant="plain"
									className="w-full mt-10 mb-5"
									onClick={() => fetchMoreTransactions("pending")}
								>
									{t("COMMON.VIEW_MORE")}
								</Button>
							)}
						</>
					</div>

					<div>
						<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY")}</h2>
						<>
							<TransactionTable
								transactions={transactions}
								exchangeCurrency={exchangeCurrency}
								isLoading={isLoading}
								skeletonRowsLimit={txSkeletonRowsLimit}
							/>
							{transactions.length > 0 && (
								<Button
									data-testid="transactions__fetch-more-button"
									variant="plain"
									className="w-full mt-10 mb-5"
									onClick={() => fetchMoreTransactions()}
								>
									{t("COMMON.VIEW_MORE")}
								</Button>
							)}
						</>
					</div>
				</Section>
			</Page>

			{wallets && wallets.length > 1 && <WalletBottomSheetMenu wallets={wallets} />}

			<UpdateWalletName
				name={activeWallet?.alias()}
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
		</>
	);
};

WalletDetails.defaultProps = {
	txSkeletonRowsLimit: 8,
};
