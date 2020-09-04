import { NetworkData, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
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
	networks: NetworkData[];
	profile: Profile;
	children?: React.ReactNode;
};

export const SendTransactionForm = ({ children, networks, profile }: SendTransactionFormProps) => {
	const history = useHistory();
	const { env } = useEnvironmentContext();
	const { t } = useTranslation();
	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);

	const form = useFormContext();
	const { getValues, setValue } = form;
	const { network, senderAddress } = form.watch();
	const [feeOptions, setFeeOptions] = useState({
		last: undefined,
		min: (0 * 1e8).toFixed(0),
		max: (100 * 1e8).toFixed(0),
		average: (14 * 1e8).toFixed(0),
	});

	const fee = getValues("fee") || null;

	useEffect(() => {
		// TODO: shouldn't be necessary once SelectAddress returns wallets instead
		const senderWallet = profile.wallets().findByAddress(senderAddress);

		if (senderWallet) {
			const transactionFees = env.fees().findByType(senderWallet.coinId(), senderWallet.networkId(), "transfer");

			setFeeOptions({
				last: undefined,
				min: transactionFees.min,
				max: transactionFees.max,
				average: transactionFees.avg,
			});

			setValue("fee", transactionFees.avg, true);
		}
	}, [env, setFeeOptions, setValue, profile, senderAddress]);

	useEffect(() => {
		if (network) {
			setWallets(profile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}
	}, [network, profile]);

	const onSelectSender = (address: any) => {
		setValue("senderAddress", address, true);

		const wallet = wallets.find((wallet) => wallet.address() === address);
		history.push(`/profiles/${profile.id()}/transactions/${wallet!.id()}/transfer`);
	};

	return (
		<div className="space-y-8 SendTransactionForm">
			<FormField name="network" className="relative">
				<div className="mb-2">
					<FormLabel label="Network" />
				</div>
				<SelectNetwork id="SendTransactionForm__network" networks={networks} selected={network} disabled />
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
					{...feeOptions}
					defaultValue={fee || 0}
					value={fee || 0}
					step={0.01}
					onChange={(value: any) => setValue("fee", value, true)}
				/>
			</FormField>
		</div>
	);
};
