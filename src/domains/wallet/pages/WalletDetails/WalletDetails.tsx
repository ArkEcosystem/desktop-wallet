/* eslint-disable @typescript-eslint/require-await */
import { Coins } from "@arkecosystem/platform-sdk";
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
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const WalletDetails = () => {
	const [isUpdateWalletName, setIsUpdateWalletName] = useState(false);
	const [isSigningMessage, setIsSigningMessage] = useState(false);
	const [isDeleteWallet, setIsDeleteWallet] = useState(false);
	const [votes, setVotes] = React.useState<Coins.WalletDataCollection>();
	const [walletData, setWalletData] = React.useState<WalletData>();
	const [isVerifyingMessage, setIsVerifyingMessage] = useState(false);

	const history = useHistory();
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();
	const wallets = React.useMemo(() => activeProfile!.wallets().values(), [activeProfile]);

	const coinName = activeWallet!.coin().manifest().get<string>("name");
	const networkName = activeWallet!.network().name;

	const dashboardRoute = `/profiles/${activeProfile?.id()}/dashboard`;
	const crumbs = [
		{
			route: dashboardRoute,
			label: "Go back to Portfolio",
		},
	];

	// TODO: Replace logic with sdk
	const getVotes = React.useCallback(async () => {
		const response = await activeWallet!.votes();
		const transaction = response.data.first();
		const result: WalletData[] = [];

		const votes = (transaction?.asset().votes as string[]) || [];

		for (const vote of votes) {
			const mode = vote[0];
			const publicKey = vote.substr(1);
			/* istanbul ignore next */
			if (mode === "-") {
				continue;
			}

			const data = await activeWallet!.coin().client().wallet(publicKey);
			result.push(data);
		}

		setVotes(() => new WalletDataCollection(result));
	}, [activeWallet]);

	// TODO: Hacky to access `WalletData` instead of `Wallet`
	const getWalletData = React.useCallback(async () => {
		const data = await activeWallet!.coin().client().wallet(activeWallet!.id());
		setWalletData(data);
	}, [activeWallet]);

	const handleDeleteWallet = async () => {
		activeProfile?.wallets().forget(activeWallet!.id());
		await persist();
		setIsDeleteWallet(false);
		history.push(dashboardRoute);
	};

	const handleUpdateName = async ({ name }: any) => {
		activeWallet?.settings().set(WalletSetting.Alias, name);
		await persist();
		setIsUpdateWalletName(false);
	};

	React.useEffect(() => {
		getVotes();
	}, [getVotes]);

	React.useEffect(() => {
		getWalletData();
	}, [getWalletData]);

	React.useEffect(() => {
		const timer = setInterval(async () => {
			await activeWallet!.syncIdentity();
			await persist();
		}, 30000);

		return () => clearInterval(timer);
	}, [activeWallet, persist]);

	/* istanbul ignore next */
	return (
		<>
			<Page crumbs={crumbs}>
				<WalletHeader
					coin={coinName!}
					network={networkName}
					address={activeWallet?.address()}
					publicKey={activeWallet?.publicKey()}
					balance={activeWallet?.balance().toString()}
					currencyBalance={activeWallet?.fiat().toString()}
					name={activeWallet?.alias()}
					isLedger={activeWallet?.isLedger()}
					isMultisig={activeWallet?.isMultiSignature()}
					hasStarred={activeWallet?.isStarred()}
					onSend={() => history.push(`/profiles/${activeProfile?.id()}/transactions/transfer`)}
					onUpdateWalletName={() => setIsUpdateWalletName(true)}
					onVerifyMessage={() => setIsVerifyingMessage(true)}
					onSignMessage={() => setIsSigningMessage(true)}
					onDeleteWallet={() => setIsDeleteWallet(true)}
				/>

				<Section>{votes && <WalletVote votes={votes} />}</Section>

				<Section>
					{walletData && (
						<WalletRegistrations
							address={activeWallet?.address()}
							delegate={activeWallet?.isDelegate() ? walletData : undefined}
							business={undefined}
							isMultisig={activeWallet?.isMultiSignature()}
							hasBridgechains={false}
							hasSecondSignature={activeWallet?.isSecondSignature()}
							hasPlugins={false}
							onShowAll={() => history.push(`/profiles/${activeProfile?.id()}/registrations`)}
							onRegister={() =>
								history.push(`/profiles/${activeProfile?.id()}/transactions/registration`)
							}
						/>
					)}
				</Section>

				<Section>
					<div className="mb-16">
						<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.PENDING_TRANSACTIONS")}</h2>
						<TransactionTable transactions={[]} showSignColumn />
					</div>

					<div>
						<h2 className="mb-6 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.TRANSACTION_HISTORY")}</h2>
						<TransactionTable transactions={[]} currencyRate="2" />
					</div>
				</Section>
			</Page>

			{wallets && wallets.length > 1 && (
				<WalletBottomSheetMenu walletsData={wallets.map((wallet) => ({ wallet }))} />
			)}

			<UpdateWalletName
				isOpen={isUpdateWalletName}
				onClose={() => setIsUpdateWalletName(false)}
				onCancel={() => setIsUpdateWalletName(false)}
				onSave={handleUpdateName}
			/>

			<SignMessage
				profileId={activeProfile!.id()}
				walletId={activeWallet!.id()}
				signatoryAddress={activeWallet!.address()}
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
				walletId={walletId}
				profileId={activeProfile?.id() as string}
				signatory={wallet?.publicKey}
			/>
		</>
	);
};
