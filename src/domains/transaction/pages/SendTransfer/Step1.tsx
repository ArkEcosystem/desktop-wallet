import { Coins } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { FormField, FormHelperText, FormLabel } from "app/components/Form";
import { InputCounter } from "app/components/Input";
import { AddRecipient } from "domains/transaction/components/AddRecipient";
import { RecipientListItem } from "domains/transaction/components/RecipientList/RecipientList.models";
import { SendTransactionForm } from "domains/transaction/components/SendTransactionForm";
import React, { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FormStep = ({
	networks,
	profile,
	deeplinkProps,
}: {
	networks: Coins.Network[];
	profile: Profile;
	deeplinkProps: any;
}) => {
	const { t } = useTranslation();
	const { getValues, setValue, watch } = useFormContext();
	const { recipients, smartbridge } = getValues();
	const { senderAddress, fee } = watch();

	const feeSatoshi = fee?.display ? fee.value : fee;
	const senderWallet = profile.wallets().findByAddress(senderAddress);
	const maxAmount = senderWallet ? BigNumber.make(senderWallet.balance()).minus(feeSatoshi) : BigNumber.ZERO;

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

	return (
		<section data-testid="SendTransfer__step--first">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">
					{t("TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.DESCRIPTION")}
				</div>
			</div>
			<div className="mt-8">
				<SendTransactionForm networks={networks} profile={profile}>
					<>
						<div data-testid="recipient-address">
							<AddRecipient
								assetSymbol={senderWallet?.currency()}
								maxAvailableAmount={maxAmount}
								profile={profile}
								onChange={(recipients: RecipientListItem[]) =>
									setValue("recipients", recipients, { shouldValidate: true, shouldDirty: true })
								}
								recipients={getRecipients()}
							/>
						</div>

						<FormField name="smartbridge" className="relative">
							<FormLabel label="Smartbridge" required={false} />
							<InputCounter
								data-testid="Input__smartbridge"
								type="text"
								placeholder=" "
								className="pr-24"
								maxLengthLabel="255"
								defaultValue={smartbridge}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setValue("smartbridge", e.target.value, { shouldDirty: true, shouldValidate: true })
								}
							/>
							<FormHelperText />
						</FormField>
					</>
				</SendTransactionForm>
			</div>
		</section>
	);
};
