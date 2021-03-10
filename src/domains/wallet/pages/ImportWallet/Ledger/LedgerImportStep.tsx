import { Network } from "@arkecosystem/platform-sdk/dist/coins";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Amount } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { InputDefault } from "app/components/Input";
import { Tooltip } from "app/components/Tooltip";
import { LedgerData } from "app/contexts/Ledger";
import { TransactionDetail, TransactionNetwork } from "domains/transaction/components/TransactionDetail";
import { UpdateWalletName } from "domains/wallet/components/UpdateWalletName";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext, Validate } from "react-hook-form";
import { useTranslation } from "react-i18next";

const MultipleImport = ({
	wallets,
	profile,
	network,
	validation,
}: {
	wallets: LedgerData[];
	profile: Profile;
	network: Network;
	validation: Validate;
}) => {
	const { t } = useTranslation();
	const { register, setValue, getValues } = useFormContext();
	const [selectedAddress, setSelectedAddress] = useState<string | undefined>(undefined);

	const handleUpdateName = (alias: string) => {
		setValue(`names.${selectedAddress}`, alias, { shouldDirty: true, shouldValidate: true });
		setSelectedAddress(undefined);
	};

	const closeUpdateNameModal = () => {
		setSelectedAddress(undefined);
	};

	useEffect(() => {
		for (const wallet of wallets) {
			register({ name: `names.${wallet.address}`, type: "custom" });
		}
	}, [register, wallets]);

	return (
		<>
			<ul>
				{wallets.map((wallet) => (
					<li key={wallet.address}>
						<TransactionDetail
							className="py-4"
							paddingPosition="none"
							borderPosition="bottom"
							extra={
								<Tooltip content={t("WALLETS.PAGE_IMPORT_WALLET.WALLET_NAME")}>
									<Button
										data-testid="LedgerImportStep__edit-alias"
										type="button"
										variant="secondary"
										onClick={() => setSelectedAddress(wallet.address)}
									>
										<Icon name="Edit" />
									</Button>
								</Tooltip>
							}
						>
							<div className="flex items-center space-x-3">
								<Avatar size="lg" address={wallet.address} />
								<div>
									<Address
										maxNameChars={8}
										addressClass={`font-bold ${
											getValues(`names.${wallet.address}`) ? "text-theme-secondary-400" : ""
										}`}
										walletNameClass="font-bold"
										walletName={getValues(`names.${wallet.address}`)}
										address={wallet.address}
										maxChars={0}
									/>
									<p className="text-theme-secondary-500 text-sm mt-1 font-medium">
										<Amount value={wallet.balance!} ticker={network.ticker()} />
									</p>
								</div>
							</div>
						</TransactionDetail>
					</li>
				))}
			</ul>

			<UpdateWalletName
				currentAlias={getValues(`names.${selectedAddress}`)}
				profile={profile}
				isOpen={!!selectedAddress}
				onClose={closeUpdateNameModal}
				onCancel={closeUpdateNameModal}
				onSave={handleUpdateName}
				validation={validation}
			/>
		</>
	);
};

const SingleImport = ({
	wallets,
	profile,
	network,
	validation,
}: {
	wallets: LedgerData[];
	profile: Profile;
	network: Network;
	validation: Validate;
}) => {
	const { t } = useTranslation();
	const { register, watch, trigger } = useFormContext();

	return (
		<ul>
			{wallets.map((wallet, index) => (
				<li key={wallet.address}>
					<TransactionDetail
						label={t("COMMON.ADDRESS")}
						extra={<Avatar size="lg" address={wallet.address} />}
						borderPosition="bottom"
						paddingPosition="bottom"
					>
						<Address address={wallet.address} maxChars={0} />
					</TransactionDetail>

					<TransactionDetail label={t("COMMON.BALANCE")} paddingPosition="both" border={false}>
						<Amount value={wallet.balance!} ticker={network.ticker()} />
					</TransactionDetail>

					<FormField name={`names.${wallet.address}`}>
						<FormLabel label={t("WALLETS.PAGE_IMPORT_WALLET.WALLET_NAME")} required={false} optional />
						<InputDefault
							onChange={() => {
								for (const address of Object.keys(watch("names"))) {
									trigger(`names.${address}`);
								}
							}}
							ref={register({
								maxLength: {
									value: 42,
									message: t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.MAXLENGTH_ERROR", {
										maxLength: 42,
									}),
								},
								validate: {
									duplicateAlias: (alias) =>
										!alias ||
										!profile.wallets().findByAlias(alias.trim()) ||
										t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.ALIAS_EXISTS", {
											alias: alias.trim(),
										}).toString(),
									validation,
								},
							})}
							data-testid="ImportWallet__name-input"
						/>
					</FormField>

					{index !== wallets.length - 1 && <Divider />}
				</li>
			))}
		</ul>
	);
};

export const LedgerImportStep = ({ wallets, profile }: { wallets: LedgerData[]; profile: Profile }) => {
	const { t } = useTranslation();
	const { watch } = useFormContext();

	const [network] = useState<Network>(() => watch("network"));
	const names = watch("names", {});

	const duplicateFormAlias = useCallback(
		(alias: string) => {
			const values = Object.values(names);
			const hasSameValue = values.some(
				(name: any) => !!name && alias.trim().toLowerCase() === name.trim().toLowerCase(),
			);

			if (alias && hasSameValue) {
				return t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.ALIAS_ASSIGNED", {
					alias: alias.trim(),
				}).toString();
			}

			return true;
		},
		[t, names],
	);

	return (
		<section data-testid="LedgerImportStep" className="space-y-6">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.PROCESS_COMPLETED_STEP.SUBTITLE")}
			/>

			<TransactionNetwork network={network} borderPosition="bottom" paddingPosition="bottom" />

			{wallets.length > 1 ? (
				<MultipleImport wallets={wallets} profile={profile} network={network} validation={duplicateFormAlias} />
			) : (
				<SingleImport wallets={wallets} profile={profile} network={network} validation={duplicateFormAlias} />
			)}
		</section>
	);
};
