import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { useEnvironmentContext } from "app/contexts";
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
	const { env } = useEnvironmentContext();
	const { t } = useTranslation();
	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);
	const [availableNetworks, setAvailableNetworks] = useState<Coins.Network[]>([]);

	const form = useFormContext();
	const { getValues, setValue, watch } = form;
	const { network, senderAddress } = watch();

	const [fees, setFees] = useState<Contracts.TransactionFee>({
		static: "0",
		min: "0",
		avg: "0",
		max: "0",
	});

	// getValues does not get the value of `defaultValues` on first render
	const [defaultFee] = useState(() => watch("fee"));
	const fee = getValues("fee") || defaultFee;

	useEffect(() => {
		// TODO: shouldn't be necessary once SelectAddress returns wallets instead
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		const setTransactionFees = async (senderWallet: ReadWriteWallet) => {
			await env.fees().syncAll();
			const transactionFees = env
				.fees()
				.findByType(senderWallet.coinId(), senderWallet.networkId(), transactionType);

			setFees(transactionFees);
			setValue("fees", transactionFees);
			setValue("fee", transactionFees.avg || transactionFees.static, { shouldValidate: true, shouldDirty: true });
		};

		if (senderWallet) {
			setTransactionFees(senderWallet);
		}
	}, [env, setFees, setValue, profile, senderAddress, transactionType]);

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
					defaultValue={fee || 0}
					value={fee || 0}
					step={0.01}
					onChange={(currency) => {
						setValue("fee", currency.value, { shouldValidate: true, shouldDirty: true });
					}}
				/>
				<FormHelperText />
			</FormField>
		</div>
	);
};

SendTransactionForm.defaultProps = {
	transactionType: "transfer",
	hasWalletId: false,
};
