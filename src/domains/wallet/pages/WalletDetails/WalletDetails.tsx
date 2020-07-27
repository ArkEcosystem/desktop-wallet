import { Coins } from "@arkecosystem/platform-sdk";
import { Wallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import { DeleteWallet } from "domains/wallet/components/DeleteWallet";
import { SignMessage } from "domains/wallet/components/SignMessage";
import { UpdateWalletName } from "domains/wallet/components/UpdateWalletName";
import { WalletBottomSheetMenu } from "domains/wallet/components/WalletBottomSheetMenu";
import { WalletHeader } from "domains/wallet/components/WalletHeader/WalletHeader";
import { WalletRegistrations } from "domains/wallet/components/WalletRegistrations";
import { WalletVote } from "domains/wallet/components/WalletVote";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

export const WalletDetails = () => {
	const [isSigningMessage, setIsSigningMessage] = useState(false);
	const [isSigned, setIsSigned] = useState(false);
	const [isDeleteWallet, setIsDeleteWallet] = useState(false);
	const [isUpdateWalletNameOpen, setIsUpdateWalletNameOpen] = useState(false);
	const [wallet, setWallet] = useState<Wallet | undefined>((null as unknown) as Wallet);
	const [wallets, setWallets] = useState<Wallet[] | undefined>([]);
	const [delegates, setDelegates] = useState<Coins.WalletDataCollection>(
		(null as unknown) as Coins.WalletDataCollection,
	);

	const history = useHistory();
	const { persist } = useEnvironmentContext();
	const { t } = useTranslation();
	const activeProfile = useActiveProfile();
	const { walletId } = useParams();

	const dashboardRoute = `/profiles/${activeProfile?.id()}/dashboard`;
	const crumbs = [
		{
			route: dashboardRoute,
			label: "Go back to Portfolio",
		},
	];

	const handleDeleteWallet = async () => {
		activeProfile?.wallets().forget(walletId);
		await persist();
		setIsDeleteWallet(false);
		history.push(dashboardRoute);
	};

	React.useEffect(() => {
		const timer = setInterval(() => {
			const wallets = activeProfile?.wallets().values();
			const wallet = activeProfile?.wallets().findById(walletId);

			setWallet(wallet);
			setWallets(wallets);

			wallet?.delegates().then((delegates) => {
				setDelegates(delegates.data);
			});
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const coinName = wallet?.coin().manifest().get<string>("name") || "";

	const handleUpdateName = async ({ name }: any) => {
		const wallet = activeProfile?.wallets().findById(walletId);
		wallet?.settings().set(WalletSetting.Alias, name);
		await persist();
		setIsUpdateWalletNameOpen(false);
	};

	/* istanbul ignore next */
	return (
		<>
			<Page crumbs={crumbs}>
				<WalletHeader
					coin={coinName}
					address={wallet?.address()}
					publicKey={wallet?.publicKey()}
					balance={wallet?.balance().toString()}
					currencyBalance={wallet?.fiat().toString()}
					name={wallet?.alias()}
					isLedger={wallet?.isLedger()}
					isMultisig={wallet?.isMultiSignature()}
					hasStarred={wallet?.isStarred()}
					onSend={() => history.push(`/profiles/${activeProfile?.id()}/transactions/transfer`)}
					onUpdateWalletName={() => setIsUpdateWalletNameOpen(true)}
					onSignMessage={() => setIsSigningMessage(true)}
					onDeleteWallet={() => setIsDeleteWallet(true)}
				/>

				<Section>{delegates && <WalletVote delegates={delegates} />}</Section>

				<Section>
					<WalletRegistrations
						address={wallet?.address()}
						delegate={wallet ? delegates?.findByAddress(wallet.address()) : undefined}
						business={undefined}
						isMultisig={wallet?.isMultiSignature()}
						hasBridgechains={false}
						hasSecondSignature={wallet?.isSecondSignature()}
						hasPlugins={false}
						onShowAll={() => history.push(`/profiles/${activeProfile?.id()}/registrations`)}
						onRegister={() => history.push(`/profiles/${activeProfile?.id()}/transactions/registration`)}
					/>
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

			<SignMessage
				isOpen={isSigningMessage}
				handleClose={() => setIsSigningMessage(false)}
				signatoryAddress={wallet?.address()}
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
		</>
	);
};
