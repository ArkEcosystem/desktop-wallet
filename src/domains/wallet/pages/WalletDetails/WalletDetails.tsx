/* eslint-disable @typescript-eslint/require-await */
import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { ProfileSetting, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { WalletDataCollection } from "@arkecosystem/platform-sdk/dist/coins";
import { WalletData } from "@arkecosystem/platform-sdk/dist/contracts";
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
	transactions: Contracts.TransactionDataType[];
	walletData?: WalletData;
	votes?: Coins.WalletDataCollection;
};

export const WalletDetails = ({ txSkeletonRowsLimit }: WalletDetailsProps) => {
	const [data, setData] = useState<WalletInfo>({ transactions: [] });

	const [isUpdateWalletName, setIsUpdateWalletName] = useState(false);
	const [isSigningMessage, setIsSigningMessage] = useState(false);
	const [isDeleteWallet, setIsDeleteWallet] = useState(false);
	const [loadingTransactions] = useState(true);
	const [isVerifyingMessage, setIsVerifyingMessage] = useState(false);

	const { t } = useTranslation();
	const { persist } = useEnvironmentContext();
	const history = useHistory();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const wallets = useMemo(() => activeProfile.wallets().values(), [activeProfile]);

	const coinName = activeWallet.manifest().get<string>("name");
	const networkId = activeWallet.network().id;
	const ticker = activeWallet.network().currency.ticker;
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
		// TODO: Replace logic with sdk
		const fetchVotes = async () => {
			let response;
			// catch 404 wallet not found until sdk logic
			try {
				response = await activeWallet.votes();
			} catch (error) {
				return;
			}

			const transaction = response.items()[0];
			const result: WalletData[] = [];

			const votes = (transaction?.asset().votes as string[]) || [];
			for (const vote of votes) {
				const mode = vote[0];
				const publicKey = vote.substr(1);
				/* istanbul ignore next */
				if (mode === "-") {
					continue;
				}

				const voteData = await activeWallet.client().wallet(publicKey);

				result.push(voteData);
			}

			return new WalletDataCollection(result, { prev: undefined, self: undefined, next: undefined });
		};

		const fetchAllData = async () => {
			const transactions = (await activeWallet.transactions({ limit: 10 })).items();
			const walletData = await activeWallet.client().wallet(activeWallet.address());
			const votes = await fetchVotes();

			setData({
				walletData,
				transactions,
				votes,
			});
		};

		fetchAllData();
	}, [activeWallet]);

	useEffect(() => {
		const timer = setInterval(async () => {
			await activeWallet.syncIdentity();
			await persist();
		}, 30000);

		return () => clearInterval(timer);
	}, [activeWallet, persist]);

	const handleDeleteWallet = async () => {
		activeProfile.wallets().forget(activeWallet.id());
		await persist();
		setIsDeleteWallet(false);
		history.push(dashboardRoute);
	};

	const handleUpdateName = async ({ name }: any) => {
		activeWallet.settings().set(WalletSetting.Alias, name);
		await persist();
		setIsUpdateWalletName(false);
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
					coin={coinName!}
					network={networkId}
					ticker={ticker}
					address={activeWallet.address()}
					publicKey={activeWallet.publicKey()}
					balance={activeWallet.balance()}
					currencyBalance={activeWallet.convertedBalance()}
					exchangeCurrency={exchangeCurrency}
					name={activeWallet.alias()}
					isLedger={activeWallet.isLedger()}
					isMultisig={activeWallet.hasSyncedWithNetwork() && activeWallet.isMultiSignature()}
					hasStarred={activeWallet.isStarred()}
					onSend={() =>
						history.push(`/profiles/${activeProfile.id()}/transactions/${activeWallet.id()}/transfer`)
					}
					onStoreHash={() =>
						history.push(`/profiles/${activeProfile.id()}/transactions/${activeWallet.id()}/ipfs`)
					}
					onUpdateWalletName={() => setIsUpdateWalletName(true)}
					onVerifyMessage={() => setIsVerifyingMessage(true)}
					onSignMessage={() => setIsSigningMessage(true)}
					onDeleteWallet={() => setIsDeleteWallet(true)}
				/>

				<Section>
					{votes && (
						<WalletVote
							votes={votes}
							onVote={() => history.push(`/profiles/${activeProfile.id()}/votes`)}
						/>
					)}
				</Section>

				<Section>
					{walletData && (
						<WalletRegistrations
							address={activeWallet.address()}
							delegate={
								activeWallet.hasSyncedWithNetwork() && activeWallet.isDelegate()
									? walletData
									: undefined
							}
							business={undefined}
							isMultisig={activeWallet.hasSyncedWithNetwork() && activeWallet.isMultiSignature()}
							hasBridgechains={true}
							hasSecondSignature={activeWallet.hasSyncedWithNetwork() && activeWallet.isSecondSignature()}
							hasPlugins={true}
							onShowAll={() => history.push(`/profiles/${activeProfile.id()}/registrations`)}
							onRegister={() => history.push(`/profiles/${activeProfile.id()}/transactions/registration`)}
						/>
					)}
				</Section>

				<Section>
					<div className="mb-16">
						<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.PENDING_TRANSACTIONS")}</h2>
						{/* TODO: Deal with pending transactions once SDK methods for it are available */}
						<>
							<TransactionTable
								transactions={transactions}
								showSignColumn
								isLoading={loadingTransactions}
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
								currencyRate="2"
								isLoading={loadingTransactions}
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

			{wallets && wallets.length > 1 && (
				<WalletBottomSheetMenu walletsData={wallets.map((wallet) => ({ wallet }))} />
			)}

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
