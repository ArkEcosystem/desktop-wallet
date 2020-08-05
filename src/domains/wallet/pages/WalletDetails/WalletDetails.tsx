/* eslint-disable @typescript-eslint/require-await */
import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { WalletDataCollection } from "@arkecosystem/platform-sdk/dist/coins";
import { WalletData } from "@arkecosystem/platform-sdk/dist/contracts";
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const WalletDetails = () => {
	const [isUpdateWalletName, setIsUpdateWalletName] = useState(false);
	const [isSigningMessage, setIsSigningMessage] = useState(false);
	const [isDeleteWallet, setIsDeleteWallet] = useState(false);
	const [transactions, setTransactions] = useState<Contracts.TransactionDataType[]>([]);
	const [votes, setVotes] = useState<Coins.WalletDataCollection>();
	const [walletData, setWalletData] = useState<WalletData>();
	const [isVerifyingMessage, setIsVerifyingMessage] = useState(false);

	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const wallets = useMemo(() => activeProfile.wallets().values(), [activeProfile]);

	const coinName = activeWallet.coin().manifest().get<string>("name");
	const networkName = activeWallet.network().name;

	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();
	const history = useHistory();

	const dashboardRoute = `/profiles/${activeProfile.id()}/dashboard`;
	const crumbs = [
		{
			route: dashboardRoute,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	// TODO: Replace logic with sdk
	const getVotes = useCallback(async () => {
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

			const data = await activeWallet.coin().client().wallet(publicKey);

			result.push(data);
		}

		setVotes(() => new WalletDataCollection(result, { prev: undefined, self: undefined, next: undefined }));
	}, [activeWallet]);

	// TODO: Hacky to access `WalletData` instead of `Wallet`
	const getWalletData = useCallback(async () => {
		const data = await activeWallet.coin().client().wallet(activeWallet.address());
		const walletTransactions = (await activeWallet.transactions()).items();

		setWalletData(data);
		setTransactions(walletTransactions);
	}, [activeWallet]);

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

	useEffect(() => {
		getVotes();
	}, [getVotes]);

	useEffect(() => {
		getWalletData();
	}, [getWalletData]);

	useEffect(() => {
		const timer = setInterval(async () => {
			await activeWallet.syncIdentity();
			await persist();
		}, 30000);

		return () => clearInterval(timer);
	}, [activeWallet, persist]);

	/* istanbul ignore next */
	return (
		<>
			<Page profile={activeProfile} crumbs={crumbs}>
				<WalletHeader
					coin={coinName!}
					network={networkName}
					address={activeWallet.address()}
					publicKey={activeWallet.publicKey()}
					balance={activeWallet.balance().toHuman(8)}
					currencyBalance={activeWallet.convertedBalance().toHuman(2)}
					name={activeWallet.alias()}
					isLedger={activeWallet.isLedger()}
					isMultisig={activeWallet.hasSyncedWithNetwork() && activeWallet.isMultiSignature()}
					hasStarred={activeWallet.isStarred()}
					onSend={() => history.push(`/profiles/${activeProfile.id()}/transactions/transfer`)}
					onUpdateWalletName={() => setIsUpdateWalletName(true)}
					onVerifyMessage={() => setIsVerifyingMessage(true)}
					onSignMessage={() => setIsSigningMessage(true)}
					onDeleteWallet={() => setIsDeleteWallet(true)}
				/>

				<Section>{votes && <WalletVote votes={votes} />}</Section>

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
						<TransactionTable transactions={transactions} showSignColumn />
					</div>

					<div>
						<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY")}</h2>
						<TransactionTable transactions={transactions} currencyRate="2" />
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
