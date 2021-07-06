import { Enums, Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputCounter } from "app/components/Input";
import { useFees } from "app/hooks";
import { toasts } from "app/services";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { SelectAddress } from "domains/profile/components/SelectAddress";
import { AddRecipient } from "domains/transaction/components/AddRecipient";
import { InputFee } from "domains/transaction/components/InputFee";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";

export const FormStep = ({
	networks,
	profile,
	deeplinkProps,
}: {
	networks: Networks.Network[];
	profile: Contracts.IProfile;
	deeplinkProps: any;
}) => {
	const { t } = useTranslation();

	const [wallets, setWallets] = useState<Contracts.IReadWriteWallet[]>([]);

	const { findByType } = useFees(profile);

	const { getValues, setValue, watch } = useFormContext();
	const { recipients, memo } = getValues();
	const { network, senderAddress, fee, fees } = watch();

	const [isSingle, setIsSingle] = useState((recipients || []).length <= 1);

	const inputFeeSettings = watch("inputFeeSettings") ?? {};

	const senderWallet = profile.wallets().findByAddress(senderAddress);

	const setTransactionFees = useCallback(
		async (network: Networks.Network) => {
			const transactionFees = await findByType(
				network.coin(),
				network.id(),
				isSingle ? "transfer" : "multiPayment",
			);

			setValue("fees", transactionFees);

			setValue("fee", transactionFees.avg, {
				shouldDirty: true,
				shouldValidate: true,
			});
		},
		[findByType, isSingle, setValue],
	);

	useEffect(() => {
		if (network) {
			setTransactionFees(network);
			setWallets(profile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}
	}, [isSingle, network, profile, setTransactionFees]);

	const getRecipients = () => {
		if (deeplinkProps?.recipient && deeplinkProps?.amount) {
			return [
				{
					address: deeplinkProps.recipient,
					amount: senderWallet?.coin().bigNumber().make(deeplinkProps.amount),
				},
			];
		}

		return recipients;
	};

	const handleSelectSender = (address: any) => {
		setValue("senderAddress", address, { shouldDirty: true, shouldValidate: false });

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

	const showFeeInput = useMemo(() => !network?.chargesZeroFees(), [network]);

	return (
		<section data-testid="SendTransfer__form-step">
			<Header
				title={t("TRANSACTION.PAGE_TRANSACTION_SEND.FORM_STEP.TITLE", { ticker: senderWallet?.currency() })}
				subtitle={t("TRANSACTION.PAGE_TRANSACTION_SEND.FORM_STEP.DESCRIPTION")}
			/>

			<div className="pt-6 space-y-6">
				<FormField name="network">
					<FormLabel label={t("COMMON.CRYPTOASSET")} />
					<SelectNetwork
						id="SendTransfer__network"
						networks={networks}
						selected={network}
						disabled
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

				<div data-testid="recipient-address">
					<AddRecipient
						assetSymbol={senderWallet?.currency()}
						profile={profile}
						wallet={senderWallet}
						recipients={getRecipients()}
						showMultiPaymentOption={network?.allows(Enums.FeatureFlag.TransactionMultiPayment)}
						disableMultiPaymentOption={senderWallet?.isLedger()}
						withDeeplink={!!deeplinkProps?.recipient}
						onChange={(value: RecipientListItem[]) =>
							setValue("recipients", value, { shouldDirty: true, shouldValidate: true })
						}
						onTypeChange={(isSingle: boolean) => {
							setIsSingle(isSingle);
							toasts.warning(t("TRANSACTION.PAGE_TRANSACTION_SEND.FORM_STEP.FEE_UPDATE"));
						}}
					/>
				</div>

				<FormField name="memo" className="relative">
					<FormLabel label="Memo" optional />
					<InputCounter
						data-testid="Input__memo"
						type="text"
						placeholder=" "
						maxLengthLabel="255"
						value={memo || ""}
						onChange={(event: ChangeEvent<HTMLInputElement>) =>
							setValue("memo", event.target.value, { shouldDirty: true, shouldValidate: true })
						}
					/>
				</FormField>

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
							disabled={network?.feeType() !== "dynamic"}
							network={network}
							profile={profile}
							onChange={(value) => {
								setValue("fee", value, { shouldDirty: true, shouldValidate: true });
							}}
							viewType={inputFeeSettings.viewType}
							onChangeViewType={(viewType) => {
								setValue(
									"inputFeeSettings",
									{ ...inputFeeSettings, viewType },
									{ shouldDirty: true, shouldValidate: true },
								);
							}}
							simpleValue={inputFeeSettings.simpleValue}
							onChangeSimpleValue={(simpleValue) => {
								setValue(
									"inputFeeSettings",
									{ ...inputFeeSettings, simpleValue },
									{ shouldDirty: true, shouldValidate: true },
								);
							}}
						/>
					</FormField>
				)}
			</div>
		</section>
	);
};
