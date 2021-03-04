import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { FormField, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { InputCounter } from "app/components/Input";
import { AddRecipient } from "domains/transaction/components/AddRecipient";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import React, { ChangeEvent, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({
	networks,
	profile,
	deeplinkProps,
	hasWalletId,
}: {
	networks: Coins.Network[];
	profile: Profile;
	deeplinkProps: any;
	hasWalletId: boolean;
}) => {
	const { t } = useTranslation();
	const { getValues, setValue, watch } = useFormContext();
	const { recipients, smartbridge } = getValues();
	const { fee, network, senderAddress } = watch();

	const senderWallet = profile.wallets().findByAddress(senderAddress);
	const maxAmount = senderWallet ? BigNumber.make(senderWallet.balance()).minus(fee) : BigNumber.ZERO;

	const getRecipients = () => {
		if (deeplinkProps?.recipient && deeplinkProps?.amount) {
			return [
				{
					address: deeplinkProps.recipient,
					amount: BigNumber.make(deeplinkProps.amount),
				},
			];
		}

		return recipients;
	};

	const availableNetworks = useMemo(() => {
		const usesTestNetworks = profile.settings().get(ProfileSetting.UseTestNetworks);
		return usesTestNetworks ? networks : networks.filter((network) => network.isLive());
	}, [profile, networks]);

	return (
		<section data-testid="SendTransfer__form-step" className="space-y-8">
			<Header
				title={t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.TITLE")}
				subtitle={t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.DESCRIPTION")}
			/>

			<SendTransactionForm networks={availableNetworks} profile={profile} hasWalletId={hasWalletId}>
				<>
					<div data-testid="recipient-address">
						<AddRecipient
							assetSymbol={senderWallet?.currency()}
							maxAvailableAmount={maxAmount}
							profile={profile}
							recipients={getRecipients()}
							showMultiPaymentOption={
								!senderWallet?.isLedger() && network?.can(Coins.FeatureFlag.TransactionMultiPayment)
							}
							withDeeplink={!!deeplinkProps?.recipient}
							onChange={(value: RecipientListItem[]) =>
								setValue("recipients", value, { shouldValidate: true, shouldDirty: true })
							}
						/>
					</div>

					<FormField name="smartbridge" className="relative">
						<FormLabel label="Smartbridge" required={false} />
						<InputCounter
							data-testid="Input__smartbridge"
							type="text"
							placeholder=" "
							maxLengthLabel="255"
							defaultValue={smartbridge}
							onChange={(event: ChangeEvent<HTMLInputElement>) =>
								setValue("smartbridge", event.target.value, { shouldDirty: true, shouldValidate: true })
							}
						/>
					</FormField>
				</>
			</SendTransactionForm>
		</section>
	);
};

FormStep.defaultProps = {
	hasWalletId: false,
};
