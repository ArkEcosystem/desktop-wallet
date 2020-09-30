import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { useEnvironmentContext } from "app/contexts";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { InputFee } from "domains/transaction/components/InputFee";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

type SendTransactionFormProps = {
	networks: Coins.Network[];
	profile: Profile;
	children?: React.ReactNode;
	transactionType: string;
};

export const SendTransactionForm = ({ children, networks, profile, transactionType }: SendTransactionFormProps) => {
	const history = useHistory();
	const { env } = useEnvironmentContext();
	const { t } = useTranslation();
	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);

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

		if (senderWallet) {
			const transactionFees = env
				.fees()
				.findByType(senderWallet.coinId(), senderWallet.networkId(), transactionType);

			setFees(transactionFees);

			setValue("fee", transactionFees.avg, { shouldValidate: true, shouldDirty: true });
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

		const wallet = wallets.find((wallet) => wallet.address() === address);
		history.push(`/profiles/${profile.id()}/wallets/${wallet!.id()}/send-transfer`);
	};

	return (
		<div className="space-y-8 SendTransactionForm">
			<FormField name="network" className="relative">
				<div className="mb-2">
					<FormLabel label="Network" />
				</div>
				<SelectNetwork
					id="SendTransactionForm__network"
					networks={networks}
					selected={network}
					disabled={!!senderAddress}
					onSelect={(selectedNetwork: Coins.Network | null | undefined) =>
						setValue("network", selectedNetwork)
					}
				/>
			</FormField>

			<FormField name="senderAddress" className="relative">
				<div className="mb-2">
					<FormLabel label="Sender" />
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
					onChange={(currency: { display: string; value: string }) => {
						setValue("fee", currency, { shouldValidate: true, shouldDirty: true });
					}}
				/>
			</FormField>
		</div>
	);
};

SendTransactionForm.defaultProps = {
	transactionType: "transfer",
};
