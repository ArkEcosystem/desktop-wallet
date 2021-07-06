import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { AmountCrypto } from "app/components/Amount";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { InputDefault } from "app/components/Input";
import { Tooltip } from "app/components/Tooltip";
import { LedgerData } from "app/contexts/Ledger";
import { TransactionDetail, TransactionNetwork } from "domains/transaction/components/TransactionDetail";
import { UpdateWalletName } from "domains/wallet/components/UpdateWalletName";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { lowerCaseEquals } from "utils/equals";

const MultipleImport = ({
	wallets,
	profile,
	network,
}: {
	wallets: LedgerData[];
	profile: Contracts.IProfile;
	network: Networks.Network;
}) => {
	const { t } = useTranslation();

	const { register, setValue, getValues, watch } = useFormContext();
	const names = watch("names", {});

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

	const validation = useCallback(
		(alias: string) => {
			const values = Object.values(names);
			const hasSameValue = values.some((name: any) => !!name && lowerCaseEquals(alias.trim(), name.trim()));

			if (alias && hasSameValue) {
				return t("WALLETS.VALIDATION.ALIAS_ASSIGNED", {
					alias: alias.trim(),
				}).toString();
			}

			return true;
		},
		[t, names],
	);

	return (
		<div>
			<ul>
				{wallets.map((wallet) => {
					const walletName = getValues(`names.${wallet.address}`);

					return (
						<li key={wallet.address}>
							<TransactionDetail
								className="py-4"
								paddingPosition="none"
								borderPosition="bottom"
								extra={
									<Tooltip content={t("WALLETS.WALLET_NAME")}>
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
										<Address walletName={walletName} address={wallet.address} maxNameChars={8} />
										<p className="mt-1 text-sm font-medium text-theme-secondary-500">
											<AmountCrypto value={wallet.balance!} ticker={network.ticker()} />
										</p>
									</div>
								</div>
							</TransactionDetail>
						</li>
					);
				})}
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
		</div>
	);
};

const SingleImport = ({
	wallets,
	profile,
	network,
}: {
	wallets: LedgerData[];
	profile: Contracts.IProfile;
	network: Networks.Network;
}) => {
	const { t } = useTranslation();
	const { register, watch, trigger } = useFormContext();

	const wallet = wallets[0];

	return (
		<>
			<TransactionDetail
				label={t("COMMON.ADDRESS")}
				extra={<Avatar size="lg" address={wallet.address} />}
				borderPosition="bottom"
				paddingPosition="bottom"
			>
				<Address address={wallet.address} />
			</TransactionDetail>

			<TransactionDetail label={t("COMMON.BALANCE")} borderPosition="bottom" paddingPosition="bottom">
				<AmountCrypto value={wallet.balance!} ticker={network.ticker()} />
			</TransactionDetail>

			<FormField name={`names.${wallet.address}`}>
				<FormLabel label={t("WALLETS.WALLET_NAME")} optional />
				<InputDefault
					onChange={() => {
						for (const address of Object.keys(watch("names"))) {
							trigger(`names.${address}`);
						}
					}}
					ref={register({
						maxLength: {
							message: t("WALLETS.VALIDATION.ALIAS_MAXLENGTH", {
								maxLength: 42,
							}),
							value: 42,
						},
						validate: {
							duplicateAlias: (alias) =>
								!alias ||
								!profile.wallets().findByAlias(alias.trim()) ||
								t("WALLETS.VALIDATION.ALIAS_ASSIGNED", {
									alias: alias.trim(),
								}).toString(),
						},
					})}
					data-testid="ImportWallet__name-input"
				/>
			</FormField>
		</>
	);
};

export const LedgerImportStep = ({ wallets, profile }: { wallets: LedgerData[]; profile: Contracts.IProfile }) => {
	const { t } = useTranslation();

	const { watch } = useFormContext();

	const [network] = useState<Networks.Network>(() => watch("network"));

	return (
		<section data-testid="LedgerImportStep" className="space-y-6">
			<Header
				title={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_IMPORT_STEP.TITLE")}
				subtitle={t("WALLETS.PAGE_IMPORT_WALLET.LEDGER_IMPORT_STEP.SUBTITLE")}
			/>

			<TransactionNetwork network={network} borderPosition="bottom" paddingPosition="bottom" />

			{wallets.length > 1 ? (
				<MultipleImport wallets={wallets} profile={profile} network={network} />
			) : (
				<SingleImport wallets={wallets} profile={profile} network={network} />
			)}
		</section>
	);
};
