import { Coins, Contracts } from "@arkecosystem/platform-sdk";
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
	const { findByType } = useFees();

	const form = useFormContext();
	const { getValues, setValue, watch } = form;
	const { network, senderAddress } = watch();

	const [fees, setFees] = useState<Contracts.TransactionFee>({
		static: "5",
		min: "0",
		avg: "1",
		max: "2",
	});

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	useEffect(() => {
		// TODO: shouldn't be necessary once SelectAddress returns wallets instead
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		const setTransactionFees = async (senderWallet: ReadWriteWallet) => {
			const transactionFees = await findByType(senderWallet.coinId(), senderWallet.networkId(), transactionType);

			setFees(transactionFees);
			setValue("fees", transactionFees);
			setValue("fee", transactionFees.avg, { shouldValidate: true, shouldDirty: true });
		};

		if (senderWallet) {
			setTransactionFees(senderWallet);
		}
	}, [setFees, setValue, profile, senderAddress, transactionType, findByType]);

	useEffect(() => {
		if (network) {
			return setWallets(profile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}

		setWallets(profile.wallets().values());
	}, [network, profile]);

	const onSelectSender = (address: any) => {
		setValue("senderAddress", address, { shouldValidate: true, shouldDirty: true });
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
			<FormField name="network" className="relative">
				<div className="mb-2">
					<FormLabel label={t("COMMON.CRYPTOASSET")} />
				</div>
				<SelectNetwork
					id="SendTransactionForm__network"
					networks={availableNetworks}
					selected={network}
					disabled={hasWalletId && !!senderAddress}
					onSelect={(selectedNetwork: Coins.Network | null | undefined) =>
						setValue("network", selectedNetwork)
					}
				/>
			</FormField>

			<FormField name="senderAddress" className="relative">
				<div className="mb-2">
					<FormLabel label={t("TRANSACTION.SENDER")} />
				</div>

				<div data-testid="sender-address">
					<SelectAddress
						address={senderAddress}
						wallets={wallets}
						disabled={wallets.length === 0}
						onChange={onSelectSender}
					/>
				</div>
			</FormField>

			{children}

			<FormField name="fee">
				<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
				<InputFee
					min={fees.min}
					avg={fees.avg}
					max={fees.max}
					defaultValue={fee}
					value={fee}
					step={0.01}
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
