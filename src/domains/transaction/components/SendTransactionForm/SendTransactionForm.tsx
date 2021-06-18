import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Divider } from "app/components/Divider";
import { FormField, FormLabel } from "app/components/Form";
import { useFees } from "app/hooks";
import { toasts } from "app/services";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { InputFee } from "domains/transaction/components/InputFee";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";

interface SendTransactionFormProperties {
	children?: React.ReactNode;
	networks: Networks.Network[];
	profile: Contracts.IProfile;
	transactionType: string;
	hasWalletId: boolean;
	disableNetworkField?: boolean;
}

export const SendTransactionForm = ({
	children,
	hasWalletId,
	networks,
	profile,
	transactionType,
	disableNetworkField,
}: SendTransactionFormProperties) => {
	const { t } = useTranslation();
	const [wallets, setWallets] = useState<Contracts.IReadWriteWallet[]>([]);
	const [availableNetworks, setAvailableNetworks] = useState<Networks.Network[]>([]);
	const [dynamicFees, setDynamicFees] = useState(false);

	const { findByType } = useFees(profile);

	const form = useFormContext();
	const { getValues, setValue, watch } = form;
	const { network, senderAddress, fee, fees } = watch();

	const inputFeeSettings = watch("inputFeeSettings") ?? {};

	useEffect(() => {
		const setTransactionFees = async (network: Networks.Network) => {
			const transactionFees = await findByType(network.coin(), network.id(), transactionType);

			setValue("fees", transactionFees);

			if (!getValues("fee")) {
				setValue("fee", transactionFees.avg !== 0 ? transactionFees.avg : transactionFees.static, {
					shouldValidate: true,
					shouldDirty: true,
				});
			}
		};

		if (network) {
			setTransactionFees(network);
			setDynamicFees(network.feeType() === "dynamic");

			return setWallets(profile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}

		setWallets(profile.wallets().values());
	}, [findByType, getValues, network, profile, setValue, transactionType, t]);

	const showFeeInput = useMemo(() => !network?.chargesZeroFees(), [network]);

	const handleSelectNetwork = (selectedNetwork: Networks.Network | null | undefined) => {
		/* istanbul ignore next */
		if (senderAddress && network?.id() !== selectedNetwork?.id()) {
			setValue("senderAddress", "", { shouldValidate: false, shouldDirty: true });
		}

		setValue("network", selectedNetwork);
	};

	const handleSelectSender = (address: any) => {
		setValue("senderAddress", address, { shouldValidate: false, shouldDirty: true });

		const senderWallet = profile.wallets().findByAddress(address);
		const isFullyRestoredAndSynced = senderWallet?.hasBeenFullyRestored() && senderWallet?.hasSyncedWithNetwork();

		if (!isFullyRestoredAndSynced) {
			toasts.warning(
				<Trans
					i18nKey="COMMON.ERRORS.NETWORK_ERROR"
					values={{ network: `${network.coin()} ${network.name()}` }}
					components={{ bold: <strong /> }}
				/>,
			);
			return;
		}
	};

	useEffect(() => {
		const userNetworks: string[] = [];
		const wallets: Contracts.IReadWriteWallet[] = profile.wallets().values();

		for (const wallet of wallets) {
			userNetworks.push(wallet.networkId());
		}

		setAvailableNetworks(networks.filter((network) => userNetworks.includes(network.id())));
	}, [profile, networks]);

	return (
		<section>
			<div className="space-y-5">
				<FormField name="network">
					<FormLabel label={t("COMMON.CRYPTOASSET")} />
					<SelectNetwork
						id="SendTransactionForm__network"
						networks={availableNetworks}
						selected={network}
						disabled={disableNetworkField || (hasWalletId && !!senderAddress)}
						onSelect={handleSelectNetwork}
						hideOptions
					/>
				</FormField>

				<FormField name="senderAddress">
					<FormLabel label={t("TRANSACTION.SENDER")} />

					<div data-testid="sender-address">
						<SelectAddress
							address={senderAddress}
							wallets={wallets}
							profile={profile}
							disabled={wallets.length === 0}
							onChange={handleSelectSender}
						/>
					</div>
				</FormField>

				{children}

				{showFeeInput && (
					<FormField name="fee">
						<FormLabel label={t("TRANSACTION.TRANSACTION_FEE")} />
						<InputFee
							min={fees?.min}
							avg={fees?.avg}
							max={fees?.max}
							loading={!fees}
							value={fee}
							step={0.01}
							disabled={!dynamicFees}
							network={network}
							profile={profile}
							onChange={(value) => {
								setValue("fee", value, { shouldValidate: true, shouldDirty: true });
							}}
							viewType={inputFeeSettings.viewType}
							onChangeViewType={(viewType) => {
								setValue(
									"inputFeeSettings",
									{ ...inputFeeSettings, viewType },
									{ shouldValidate: true, shouldDirty: true },
								);
							}}
							simpleValue={inputFeeSettings.simpleValue}
							onChangeSimpleValue={(simpleValue) => {
								setValue(
									"inputFeeSettings",
									{ ...inputFeeSettings, simpleValue },
									{ shouldValidate: true, shouldDirty: true },
								);
							}}
						/>
					</FormField>
				)}
			</div>

			<div className="pt-2">
				<Divider dashed />
			</div>
		</section>
	);
};

SendTransactionForm.defaultProps = {
	disableNetworkField: false,
	transactionType: "transfer",
	hasWalletId: false,
};
