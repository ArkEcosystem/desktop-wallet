import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { useFees } from "app/hooks";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { InputFee } from "domains/transaction/components/InputFee";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

type SendTransactionFormProps = {
	children?: React.ReactNode;
	networks: Coins.Network[];
	profile: Profile;
	transactionType: string;
	hasWalletId: boolean;
};

export const SendTransactionForm = ({
	children,
	hasWalletId,
	networks,
	profile,
	transactionType,
}: SendTransactionFormProps) => {
	const { t } = useTranslation();
	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);
	const [availableNetworks, setAvailableNetworks] = useState<Coins.Network[]>([]);
	const [dynamicFees, setDynamicFees] = useState(false);

	const { findByType } = useFees();

	const form = useFormContext();
	const { getValues, setValue, watch } = form;
	const { network, senderAddress } = watch();

	const { fee, fees } = watch();

	useEffect(() => {
		const setTransactionFees = async (network: Coins.Network) => {
			const transactionFees = await findByType(network.coin(), network.id(), transactionType);

			setValue("fees", transactionFees);

			if (!getValues("fee")) {
				setValue("fee", transactionFees.avg !== "0" ? transactionFees.avg : transactionFees.static, {
					shouldValidate: true,
					shouldDirty: true,
				});
			}
		};

		if (network) {
			setTransactionFees(network);
			setDynamicFees(network.can(Coins.FeatureFlag.MiscellaneousDynamicFees));

			return setWallets(profile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}

		setWallets(profile.wallets().values());
	}, [findByType, getValues, network, profile, setValue, transactionType]);

	const handleSelectNetwork = (selectedNetwork: Coins.Network | null | undefined) => {
		/* istanbul ignore next */
		if (senderAddress && network?.id() !== selectedNetwork?.id()) {
			setValue("senderAddress", "", { shouldValidate: false, shouldDirty: true });
		}

		setValue("network", selectedNetwork);
	};

	const handleSelectSender = (address: any) => {
		setValue("senderAddress", address, { shouldValidate: false, shouldDirty: true });
	};

	useEffect(() => {
		const userNetworks: string[] = [];
		const wallets: ReadWriteWallet[] = profile.wallets().values();

		for (const wallet of wallets) {
			userNetworks.push(wallet.networkId());
		}

		setAvailableNetworks(networks.filter((network) => userNetworks.includes(network.id())));
	}, [profile, networks]);

	return (
		<div className="space-y-8 SendTransactionForm">
			<FormField name="network">
				<FormLabel label={t("COMMON.CRYPTOASSET")} />
				<SelectNetwork
					id="SendTransactionForm__network"
					networks={availableNetworks}
					selected={network}
					disabled={hasWalletId && !!senderAddress}
					onSelect={handleSelectNetwork}
				/>
			</FormField>

			<FormField name="senderAddress">
				<FormLabel label={t("TRANSACTION.SENDER")} />

				<div data-testid="sender-address">
					<SelectAddress
						address={senderAddress}
						wallets={wallets}
						disabled={wallets.length === 0}
						onChange={handleSelectSender}
					/>
				</div>
			</FormField>

			{children}

			<FormField name="fee">
				<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
				<InputFee
					min={fees?.min}
					avg={fees?.avg}
					max={fees?.max}
					value={fee}
					step={0.01}
					showFeeOptions={dynamicFees}
					onChange={(currency) => {
						setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true });
					}}
				/>
			</FormField>
		</div>
	);
};

SendTransactionForm.defaultProps = {
	transactionType: "transfer",
	hasWalletId: false,
};
