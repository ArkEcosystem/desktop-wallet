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
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { WalletHeader, WalletRegistrations, WalletVote } from "./components";

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
	const maxVotes = useMemo(() => activeWallet.network().maximumVotes(), [activeWallet]);

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
				console.log(walletData);
				votes = activeWallet.votes();
				// votes = env.delegates().all("ARK", "devnet").slice(0, 10);
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

	const handleVoteButton = (address?: string) => {
		if (address) {
			return history.push({
				pathname: `/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/send-vote`,
				search: `?unvotes=${address}`,
			});
		}

		history.push(`/profiles/${activeProfile.id()}/wallets/${activeWallet.id()}/votes`);
	};

	const handleRegistrationsButton = () => {
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
					<div className="flex">
						<div className="w-1/2 pr-12 border-r border-theme-neutral-300">
							<WalletVote
								votes={votes}
								maxVotes={maxVotes}
								isLoading={isLoading}
								onButtonClick={handleVoteButton}
							/>
						</div>

						<div className="w-1/2 pl-12">
							<WalletRegistrations
								business={undefined}
								delegate={
									activeWallet.hasSyncedWithNetwork() && activeWallet.isDelegate()
										? walletData
										: undefined
								}
								hasBridgechains={false} // @TODO
								hasSecondSignature={
									activeWallet.hasSyncedWithNetwork() && activeWallet.isSecondSignature()
								}
								hasPlugins={false} // @TODO
								isLoading={isLoading}
								isMultisig={activeWallet.hasSyncedWithNetwork() && activeWallet.isMultiSignature()}
								onButtonClick={handleRegistrationsButton}
							/>
						</div>
					</div>
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
